# Hoverkraft Landing Page

Marketing site for Hoverkraft, built with [Astro](https://astro.build/) 6 and Tailwind CSS. The production code lives under `application/` and is packaged for deployment as a static site.

## Requirements

- Node.js 22.12+
- npm 9+
- Docker (optional, used by linting workflow)

## Getting Started

```bash
make setup   # Prepare stack to run
make start     # Run Astro dev server on http://localhost:4321
```

To preview a production build locally:

```bash
make build
npm run preview --prefix application
```

## Development Workflow

- `make lint` – Run Biome and Astro checks (accepts globs: `make lint src/pages`)
- `make lint-fix` – Apply automated fixes via npm audit + Dockerized linter
- `make build` – Run `astro check` and produce a production build
- `make ci` – Run prepare, lint, and build sequentially
- `npm run preview --prefix application` – Serve the built site for QA
- `npm test --prefix application` – Run unit tests and Platform Builder browser tests, also included in CI.
- `npm run test:browser --prefix application` – Run only the Platform Builder browser tests. The suite starts and stops its own local Astro server and uses the installed Puppeteer browser; no running server or production build is needed.

Most changes should happen inside `application/`. See `AGENTS.md` for detailed automation guardrails.

## Project Structure

- `application/astro.config.ts` – Astro configuration, integrations, and Partytown setup
- `application/src/config.yaml` – Site metadata, feature toggles, and analytics IDs
- `application/src/i18n/ui.ts` – Shared UI strings for `fr` (default) and `en` locales
- `application/src/data/platform-workflow.ts` – French and English workflow stages, technology links, and illustrative implementation approaches for `/platform-builder` and `/en/platform-builder`
- `application/src/components/platform/` – Full-width platform builder with a technology palette, six architecture stages, and explorable connections. Place providers by clicking or dragging, remove them from the canvas, start from an example architecture, and inspect each stage's handoff. The builder follows the site's light/dark theme and supports keyboard and smaller screens; stage explanations and provider links remain readable without JavaScript
- `application/src/assets/images` – Optimized assets consumed via the shared `Image` component
- `application/src/content/` and `application/src/data/` – Blog posts and data-driven content
- `application/src/content.config.ts` – Astro content collections and schema definitions

## Configuration Notes

- Keep locale strings synchronized in `application/src/i18n/ui.ts`
- Update metadata and analytics via `application/src/config.yaml` instead of hardcoding values
- Follow the frontmatter schema in `application/src/content.config.ts` when adding content

## Contributing

Contributions, issues, and feature requests are welcome. Review the [contributing guide](CONTRIBUTING.md) and use the [issue tracker](https://github.com/hoverkraft-tech/landing-page/issues) to report bugs or request features.

## License

This project is released under the [0BSD License](LICENSE).
