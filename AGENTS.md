# AGENTS.md — agent instructions and operational contract

This file is written for automated coding agents (for example: Copilot coding agents). It exists to provide a concise operational contract and guardrails for agents working in this repository. It is not the canonical source for design or style rules. Those live in the developer documentation linked below.

## Organization-wide guidelines (required)

- Follow the prioritized shared instructions in [hoverkraft-tech/.github/AGENTS.md](https://github.com/hoverkraft-tech/.github/blob/main/AGENTS.md) before working in this repository.

## Repository-specific guidelines (required)

- Ensure all code changes maintain compatibility with the existing Astro framework and Tailwind CSS design system used in this project.
- When adding new features, ensure they integrate seamlessly with the existing i18n setup, particularly regarding default and secondary locales.
- When modifying or adding blog posts, adhere to the established frontmatter structure and permalink conventions.
- Always run linting and build checks (`npm run lint` and `npm run build`) before finalizing any code changes to ensure code quality and consistency.
- Avoid hard-coding configuration values; instead, use the `src/config.yaml` file for site metadata, analytics IDs, and blog toggles.
- When working with images, store optimized assets in `src/assets/images` and reference them using the established import patterns to ensure proper metadata resolution.
- Ensure that any new components or utilities follow the existing TypeScript interfaces defined in `src/types.d.ts` to maintain type safety and consistency across the codebase.
- When implementing analytics, use the configuration provided in `src/config.yaml` and avoid hard-coding vendor IDs in components.
- If integrating third-party scripts, consider using the Partytown setup as configured in `astro.config.ts` to optimize performance.
