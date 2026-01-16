# Hoverkraft Landing Page

Marketing site for Hoverkraft, built with [Astro](https://astro.build/) 5 and Tailwind CSS. The production code lives under `application/` and is packaged for deployment as a static site.

## Requirements

- Node.js 18.17+ (or 20.3+/21+)
- npm 9+
- Docker (optional, used by linting workflow)

## Getting Started

```bash
make install   # Prepare stack to run
make start     # Run Astro dev server on http://localhost:4321
```

To preview a production build locally:

```bash
make build
npm run preview --prefix application
```

## Development Workflow

- `make lint` – Run Prettier and Astro checks (accepts globs: `make lint src/pages`)
- `make lint-fix` – Apply automated fixes via npm audit + Dockerized linter
- `make build` – Run `astro check` and produce a production build
- `make ci` – Run prepare, lint, and build sequentially
- `npm run preview --prefix application` – Serve the built site for QA

Most changes should happen inside `application/`. See `AGENTS.md` for detailed automation guardrails.

## Project Structure

- `application/astro.config.ts` – Astro configuration, integrations, and Partytown setup
- `application/src/config.yaml` – Site metadata, feature toggles, and analytics IDs
- `application/src/i18n/ui.ts` – Shared UI strings for `fr` (default) and `en` locales
- `application/src/assets/images` – Optimized assets consumed via the shared `Image` component
- `application/src/content/` and `application/src/data/` – Blog posts and data-driven content

## Configuration Notes

- Keep locale strings synchronized in `application/src/i18n/ui.ts`
- Update metadata and analytics via `application/src/config.yaml` instead of hardcoding values
- Follow the frontmatter schema in `application/src/content/config.ts` when adding content

## Contributing

Contributions, issues, and feature requests are welcome. Review the [contributing guide](CONTRIBUTING.md) and use the [issue tracker](https://github.com/hoverkraft-tech/landing-page/issues) to report bugs or request features.

## License

This project is released under the [0BSD License](LICENSE).
