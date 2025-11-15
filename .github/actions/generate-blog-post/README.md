# Generate Blog Post Action

GitHub Action to generate bilingual blog posts from release data using OpenAI.

## Features

- **AI-Powered Content**: Uses OpenAI GPT-4o-mini for engaging content generation
- **Bilingual**: Generates both French and English versions
- **Image Generation**: Creates preview images with DALL-E 3
- **SOLID Principles**: Clean, modular, testable code architecture
- **Comprehensive Tests**: Full test coverage with Node.js test runner

## Inputs

| Name             | Description                                  | Required | Default       |
| ---------------- | -------------------------------------------- | -------- | ------------- |
| `releases-data`  | JSON-stringified array of releases data      | Yes      | -             |
| `since-date`     | Start date for the release period (ISO 8601) | Yes      | -             |
| `until-date`     | End date for the release period (ISO 8601)   | Yes      | -             |
| `openai-api-key` | OpenAI API key for content generation        | Yes      | -             |
| `output-dir`     | Output directory for generated files         | Yes      | `application` |

## Outputs

| Name              | Description                                      |
| ----------------- | ------------------------------------------------ |
| `slug`            | Generated slug for the blog post                 |
| `post-dir`        | Directory where post files were created          |
| `image-dir`       | Directory where image files were created         |
| `image-generated` | Whether preview image was generated (true/false) |

## Usage

```yaml
- name: Generate blog post
  uses: ./.github/actions/generate-blog-post
  with:
    releases-data: ${{ steps.fetch.outputs.releases-data }}
    since-date: ${{ steps.fetch.outputs.since-date }}
    until-date: ${{ steps.fetch.outputs.until-date }}
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
    output-dir: application
```

## Architecture

The action follows SOLID principles with separated concerns:

- **OpenAIService**: Handles all OpenAI API interactions
- **ContentGenerator**: Generates blog content
- **FileSystemService**: Manages file operations
- **BlogPostGenerator**: Orchestrates the generation process

## Testing

```bash
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Development

The action is structured for maintainability:

```
.
├── src/
│   ├── openai-service.js          # OpenAI API client
│   ├── content-generator.js       # Content generation logic
│   ├── file-system-service.js     # File operations
│   └── blog-post-generator.js     # Main orchestrator
├── __tests__/                     # Unit tests
├── index.js                       # Action entry point
├── action.yml                     # Action metadata
└── package.json                   # Dependencies
```

## License

0BSD
