# Generate Release Blog Post Workflow

Automatically generates bilingual blog posts summarizing new releases from all Hoverkraft Tech public repositories.

## Architecture

The workflow uses modular GitHub Actions following SOLID principles:

1. **fetch-releases**: Fetches releases from GitHub API
2. **generate-blog-post**: Generates AI-powered blog content using OpenAI

## Features

- ✅ **AI-Powered Content**: Uses OpenAI GPT-4o-mini for engaging, professional content
- ✅ **Automatic Images**: DALL-E 3 generates preview images
- ✅ **Bilingual**: French and English versions
- ✅ **SOLID Architecture**: Clean, modular, testable code
- ✅ **Comprehensive Tests**: Full test coverage with Jest
- ✅ **Required API Key**: OpenAI API key is mandatory for quality content

## Workflow Execution

### Schedule

- **Automatic**: 1st of every month at 9:00 AM UTC
- **Manual**: Via workflow_dispatch with optional date range

### Process

1. Fetches all public hoverkraft-tech repositories
2. Collects releases from the last 30 days (configurable)
3. Generates bilingual blog posts with AI
4. Creates preview image with DALL-E
5. Opens PR with generated content

## Dependencies

- **Node.js 20**
- **GitHub API** (GITHUB_TOKEN)
- **OpenAI API** (COPILOT_MCP_OPENAI_API_KEY secret) - **Required**
- **CI Bot** (CI_BOT_APP_ID, CI_BOT_APP_PRIVATE_KEY)

## Generated Files

```
application/src/data/post/releases-YYYY-MM/
├── common.yaml    # Metadata
├── fr.mdx        # French content (AI-generated)
└── en.mdx        # English content (AI-generated)

application/src/assets/images/blog/releases-YYYY-MM/
└── preview.png   # Generated with DALL-E 3
```

## Actions Documentation

- [fetch-releases](./.github/actions/fetch-releases/action.yml) - Fetches release data
- [generate-blog-post](./.github/actions/generate-blog-post/README.md) - Generates blog content

## Testing

Each action includes comprehensive Jest tests:

```bash
cd .github/actions/generate-blog-post
npm test                # Run tests
npm run test:coverage   # Coverage report
```

## Post-Generation

1. Review PR for content accuracy
2. Verify preview image is appropriate
3. Merge when ready

The workflow automatically handles content generation, no manual intervention needed unless the preview image generation fails.
