---
name: blog-post-image-preview
description: Specialized image generation skill for Hoverkraft's blog post preview images
version: "1.0.0"
parameters:
  - name: translation-key
    description: Unique identifier for the blog post (used for folder naming)
    required: true
    schema:
      type: string
  - name: topic
    description: Blog post topic or title for visual inspiration
    required: true
    schema:
      type: string
  - name: focus
    description: Main subject, metaphor, or concept to visualize
    required: true
    schema:
      type: string
  - name: style-hints
    description: Optional additional style guidance or specific visual elements
    required: false
    schema:
      type: string
tools:
  - bash
  - view
  - create
  - image-generator-gpt-image/image.generate.openai
mcp-servers:
  image-generator-gpt-image:
    type: "local"
    command: "npx"
    args: ["-y", "imagegen-mcp-server"]
    tools: ["image.generate.openai"]
    env:
      "OPENAI_API_KEY": "COPILOT_MCP_OPENAI_API_KEY"
      "OPENAI_IMAGE_MODEL": "gpt-image-1.5"
---

# Blog Post Image Preview Skill

Follow [../../AGENTS.md](../../AGENTS.md) before working in this repository. Create brand-aligned social preview images for Hoverkraft blog posts using the steps below.

## Steps

1. Confirm required inputs are provided (`translation-key`, `topic`, `focus`, optional `style-hints`) and choose the key visual metaphor.
2. Create the output directory before generation:
   ```bash
   mkdir -p application/src/assets/images/blog/{translation-key}
   ```
3. Generate the required preview image (`preview.png`, 1536×1024, ≤2MB) using the prompt framework:
   ```txt
   Create a 1536x1024 social preview for "[topic]".
   Focus: [main subject or metaphor].
   Style: modern, minimalist, geometric, high-detail digital illustration.
   Color palette: deep navy #1d2026 background, bright blue #1998ff and vivid orange #ff5a02 accents.
   Composition: [describe layout, centered elements, wide margins].
   Lighting: soft gradients, high contrast, no clutter, no photorealism, no text.
   ```
4. When requested, generate supporting visuals saved as `.webp` (~15-35KB) with descriptive kebab-case names:
   - **Architecture (1200×800)**
     ```txt
     Create a 1200x800 abstract architecture illustration showing [subject].
     Style: clean isometric shapes, high-detail digital illustration.
     Color palette: deep navy #1d2026 background, bright blue #1998ff nodes, soft white #f5f7fb surfaces, vivid orange #ff5a02 signals.
     Composition: [describe layout, balanced arrangement].
     Lighting: subtle gradients, no text, no people, no drop shadows.
     ```
   - **Chart/Dashboard (1024×1024)**
     ```txt
     Create a 1024x1024 radial chart highlighting [metric/concept].
     Style: modern dashboard visual, minimalist.
     Color palette: soft white #f5f7fb background, bright blue #1998ff primary segments, emerald #00d663 positive markers, vivid orange #ff5a02 contrast.
     Composition: centered with abstract ticks or icons (no alphanumeric text).
     Lighting: flat, clean, no noise.
     ```
   - **Workflow (1200×800 or 1024×1024)**
     ```txt
     Create a [size] workflow illustration for "[process]".
     Style: modern, geometric flow diagram with clean lines.
     Color palette: deep navy #1d2026 background, bright blue #1998ff primary elements, vivid orange #ff5a02 highlights.
     Composition: [left-to-right flow / circular / radial] with clear visual hierarchy.
     Lighting: soft glow, crisp edges, no photorealism, no text.
     ```
5. Save outputs to `application/src/assets/images/blog/{translation-key}/` as `preview.png` and optional supporting `.webp` files. Ensure preview readability when cropped to 1200×628 and center focal elements with safe margins.
6. Apply style guardrails: use at most three brand colors (deep navy #1d2026, bright blue #1998ff, vivid orange #ff5a02; soft white #f5f7fb for contrast, emerald #00d663 only for positive markers), geometric shapes, minimalist layouts, no text, no photorealism, and generate variations if needed.
7. Verify the quality checklist: correct dimensions and paths, clean geometric visuals, centered focus with margins, max three colors, and no distorted text or faces.
8. Report results with file paths, brief descriptions, and any issues or variations.

## Example Invocation

Call the skill with:

- **translation-key**: `platform-engineering-guide`
- **topic**: "The Complete Guide to Platform Engineering"
- **focus**: "Modular platform blocks connecting developer teams"
- **style-hints**: "Show interconnected hexagons representing platform components"

Resulting prompt:

```txt
Create a 1536x1024 social preview for "The Complete Guide to Platform Engineering".
Focus: Modular platform blocks connecting developer teams, interconnected hexagons representing platform components.
Style: modern, minimalist, geometric, high-detail digital illustration.
Color palette: deep navy #1d2026 background, bright blue #1998ff hexagonal nodes, vivid orange #ff5a02 connection lines.
Composition: Central cluster of hexagons with flowing connectors, wide empty margins, balanced layout.
Lighting: soft glow, crisp edges, no photorealism, no text.
```

## Empowered Actions

✅ Generate preview images | ✅ Generate supporting visuals | ✅ Create output directories | ✅ Iterate on image quality

❌ Don't modify blog content | ❌ Don't generate off-brand visuals | ❌ Don't include text in images | ❌ Don't skip the preview.png
