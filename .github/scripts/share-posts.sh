#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${POSTIZ_API_KEY:-}" ]]; then
  echo "POSTIZ_API_KEY secret is required" >&2
  exit 1
fi

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "OPENAI_API_KEY secret is required" >&2
  exit 1
fi

DEFAULT_SITE="${SITE_BASE_URL:-https://hoverkraft.cloud}"
DEFAULT_BLOG_PATH="${BLOG_BASE_PATH:-blog}"

readarray -t NEW_POSTS <<<"${POSTS_RAW:-}"
now="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

if [[ ${#NEW_POSTS[@]} -eq 0 || -z "${NEW_POSTS[0]}" ]]; then
  echo "No new posts to share"
  exit 0
fi

parse_field() {
  python - "$1" "$2" <<'PY'
import re
import sys
from pathlib import Path

path, key = sys.argv[1:]
text = Path(path).read_text(encoding="utf-8")
match = re.search(r"^---\n(.*?)\n---", text, re.DOTALL)
if not match:
    sys.exit(0)

for line in match.group(1).splitlines():
    if not line.strip():
        continue
    if re.match(rf"^{re.escape(key)}\s*:", line):
        value = line.split(":", 1)[1].strip().strip("\"'")
        print(value)
        break
PY
}

build_integrations() {
  if [[ -n "${POSTIZ_INTEGRATIONS_JSON:-}" ]]; then
    echo "$POSTIZ_INTEGRATIONS_JSON" | jq -c '.'
  else
    if [[ -z "${POSTIZ_INTEGRATION_IDS:-}" ]]; then
      echo "[]" ; return
    fi

    filter='split("\\n")|map(select(length>0))'
    filter+='|map({id:., type:"linkedin"})'
    echo "$POSTIZ_INTEGRATION_IDS" | tr ',' '\n' | sed '/^$/d' |
      jq -R -s "$filter"
  fi
}

integrations="$(build_integrations)"

if [[ "$(echo "$integrations" | jq 'length')" -eq 0 ]]; then
  echo "No Postiz integrations configured" >&2
  exit 1
fi

for folder in "${NEW_POSTS[@]}"; do
  base="application/src/data/post/$folder"
  common="$base/common.yaml"
  mdx="$base/en.mdx"
  [[ -f "$mdx" ]] || mdx="$base/fr.mdx"

  if [[ ! -f "$mdx" ]]; then
    echo "Skipping $folder: no MDX found" >&2
    continue
  fi

  title=$(parse_field "$mdx" "title")
  excerpt=$(parse_field "$mdx" "excerpt")
  slug=$(parse_field "$mdx" "slug")
  if [[ -z "$slug" ]]; then
    slug="$folder"
  fi

  publish_date=$(python - "$common" <<'PY'
import re
import sys
from pathlib import Path

text = Path(sys.argv[1]).read_text(encoding="utf-8")
for line in text.splitlines():
    if re.match(r"^\s*publishDate\s*:", line):
        value = line.split(":", 1)[1].strip().strip("\"'")
        print(value)
        break
PY
)
  if [[ -z "$publish_date" ]]; then
    publish_date="$now"
  fi

  url="${DEFAULT_SITE%/}/${DEFAULT_BLOG_PATH%/}/$slug"

  prompt="Write one short, engaging social post."
  prompt+=" Max 240 characters promoting a tech blog article."
  openai_payload=$(jq -n \
    --arg title "$title" \
    --arg excerpt "$excerpt" \
    --arg url "$url" \
    --arg prompt "$prompt" '{
    model: "gpt-4o-mini",
    temperature: 0.5,
    max_tokens: 120,
    messages: [
      {role: "system", content: $prompt},
      {
        role: "user",
        content: ("Title: " + $title + "\nExcerpt: " + $excerpt +
          "\nLink: " + $url)
      }
    ]
  }')

  openai_url="https://api.openai.com/v1/chat/completions"
  description=$(curl -sS -f -X POST "$openai_url" \
    -H "Authorization: Bearer ${OPENAI_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "$openai_payload" | jq -r 'try .choices[0].message.content // empty' |
    tr '\n' ' ' | sed 's/  */ /g')

  if [[ -z "$description" || "$description" == "null" ]]; then
    description="$excerpt"
  fi

  content="$description Read more: $url"

  payload=$(echo "$integrations" | jq --arg content "$content" \
    --arg date "$publish_date" '{
    type: "now",
    date: $date,
    shortLink: false,
    tags: ["blog"],
    posts: map({
      integration: { id: .id },
      value: [{ content: $content }],
      settings: { __type: (.type // "linkedin") }
    })
  }')

  echo "Sharing $folder -> $url"

  tmp_resp="$(mktemp)"
  status=$(curl -sS -w "%{http_code}" -o "$tmp_resp" -X POST "$POSTIZ_API_URL" \
    -H "Authorization: ${POSTIZ_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "$payload")

  if [[ "$status" -lt 200 || "$status" -ge 300 ]]; then
    echo "Postiz API error ($status) for $folder" >&2
    cat "$tmp_resp" >&2 || true
    exit 1
  fi

  rm -f "$tmp_resp"
done
