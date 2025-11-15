# Generate Release Blog Post Workflow

This workflow automatically generates bilingual blog posts summarizing new releases from all Hoverkraft Tech public repositories.

## Overview

The workflow runs on a monthly schedule and:
1. Fetches all public repositories from the `hoverkraft-tech` organization
2. Collects releases published in the last 30 days (configurable)
3. Generates a bilingual blog post (French & English) with release summaries
4. Creates a pull request with the generated content

## Schedule

- **Automatic**: Runs on the 1st of every month at 9:00 AM UTC
- **Manual**: Can be triggered via workflow_dispatch with custom date range

## Workflow Configuration

### Scheduled Trigger
```yaml
schedule:
  - cron: '0 9 1 * *'  # Monthly on the 1st at 9:00 AM UTC
```

### Manual Trigger
```yaml
workflow_dispatch:
  inputs:
    since-date:
      description: 'Fetch releases since this date (ISO 8601 format)'
      required: false
      type: string
```

## Generated Files

The workflow creates the following structure:

```
application/src/data/post/releases-YYYY-MM/
├── common.yaml          # Shared metadata (publishDate, image, tags, category)
├── fr.mdx              # French version of the blog post
└── en.mdx              # English version of the blog post

application/src/assets/images/blog/releases-YYYY-MM/
└── README.md           # Instructions for adding preview image
```

## Blog Post Content

Each generated blog post includes:

- **Opening quote**: Inspirational message about innovation
- **Introduction**: Summary of release activity
- **Repository sections**: One section per repository with:
  - Repository description and link
  - Star count
  - List of releases with version, date, and release notes
- **Call to action**: Encouragement to try, contribute, and share

## Post-Generation Actions

After the workflow runs:

1. **Review the PR**: Check the generated content for accuracy
2. **Add preview image**: Create and add `preview.png` (1200x630px) to the image directory
   - Can use the blog-post custom agent with text-to-image capability
   - Or use any image generation tool
3. **Merge**: Once reviewed and image added, merge the PR

## Script Details

The generation script (`.github/scripts/generate-release-blog-post.js`) handles:

- Date formatting for both French and English locales
- Slug generation based on year-month (`releases-YYYY-MM`)
- Grammar handling for singular/plural forms in both languages
- Truncation of long release notes (first 10 lines)
- Directory structure creation
- Markdown content generation following Hoverkraft style

## Dependencies

- Node.js 20
- GitHub API access (uses `GITHUB_TOKEN`)
- CI Bot token for PR creation (uses `CI_BOT_APP_ID` and `CI_BOT_APP_PRIVATE_KEY`)

## Testing

To test the workflow manually:

1. Go to Actions tab in GitHub
2. Select "Generate Release Blog Post" workflow
3. Click "Run workflow"
4. Optionally specify a custom `since-date`
5. Monitor the workflow execution

To test the script locally:

```bash
# Set environment variables
export RELEASES_DATA='[{"repo":"example","description":"Test","url":"https://github.com/hoverkraft-tech/example","stars":42,"releases":[{"name":"v1.0.0","tag":"v1.0.0","publishedAt":"2025-11-01T00:00:00Z","url":"https://github.com/hoverkraft-tech/example/releases/tag/v1.0.0","body":"Release notes"}]}]'
export SINCE_DATE="2025-10-01T00:00:00Z"
export UNTIL_DATE="2025-11-15T00:00:00Z"

# Run the script
.github/scripts/generate-release-blog-post.js
```

## Troubleshooting

### No releases found
- The workflow completes successfully but doesn't create a PR
- Check the workflow summary for the date range searched
- Try running manually with a broader date range

### Missing preview image
- The PR is created but the image is a placeholder
- Follow the instructions in the PR description to add the image
- The blog post will not render correctly without the image

### Formatting issues
- Run `npm run lint:fix:prettier` from the `application/` directory
- The workflow runs Prettier automatically, but local changes may need formatting

## Maintenance

### Updating the content template
Edit `.github/scripts/generate-release-blog-post.js`:
- Modify the `generateFrenchContent()` function for French content
- Modify the `generateEnglishContent()` function for English content
- Update formatting, structure, or styling as needed

### Changing the schedule
Edit `.github/workflows/generate-release-blog-post.yml`:
- Update the `cron` expression in the `schedule` trigger
- Use [crontab.guru](https://crontab.guru/) for cron syntax help

### Adjusting date range
- Default is 30 days
- Change the logic in the workflow's "Check for new releases" step
- Or use manual trigger with custom `since-date`

## Related Documentation

- [Blog Post Structure](../../application/src/content/config.ts)
- [Hoverkraft Blog Style Guide](../../.github/agents/blog-post.md)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
