# AGENTS.md — agent instructions and operational contract

This file is written for automated coding agents (for example: Copilot coding agents). It exists to provide a concise operational contract and guardrails for agents working in this repository. It is not the canonical source for design or style rules. Those live in the developer documentation linked below.

## Organization-wide guidelines (required)

- Follow the prioritized shared instructions in [hoverkraft-tech/.github/AGENTS.md](https://github.com/hoverkraft-tech/.github/blob/main/AGENTS.md) before working in this repository.

## Quick Start

This repository hosts Hoverkraft's marketing site, built with Astro 5 and Tailwind CSS inside the `application/` directory. Environment requirements, setup commands, and the development workflow live in the [Project README](README.md).

### Primary documentation touchpoints

- **[README — Getting Started](README.md#getting-started)** – local install and dev server commands.
- **[README — Development Workflow](README.md#development-workflow)** – linting, build, and preview tasks.
- **[README — Project Structure](README.md#project-structure)** – authoritative map of key files.
- **[README — Configuration Notes](README.md#configuration-notes)** – metadata, analytics, and i18n guidance.
- **[Contributing guide](CONTRIBUTING.md)** – branching expectations, code review process, and community standards.

## Repository-specific guidelines (required)

- Ensure all code changes maintain compatibility with the Astro framework and Tailwind design system already configured in `application/`.
- Integrate features with the existing i18n utilities so default (`fr`) and secondary (`en`) locales stay consistent.
- Preserve blog frontmatter structure and permalink patterns when updating content in `application/src/content/` or `application/src/data/`.
- Run `npm run lint` and `npm run build` from `application/` (or `make lint`/`make build`) before finalizing changes.
- Avoid hard-coding configuration values; update `application/src/config.yaml` for metadata, analytics IDs, and feature toggles.
- Store optimized assets in `application/src/assets/images` and import them via the shared `Image` component for metadata handling.
- Align new components and utilities with the shared TypeScript types in `application/src/types.d.ts`.
- Pull analytics configuration from `application/src/config.yaml`; do not inline vendor IDs.
- Use the Partytown setup in `application/astro.config.ts` for third-party scripts when possible.

## Agent-specific development patterns

- Default to the Make targets documented in the README to mirror CI behavior.
- Focus code edits inside `application/` unless explicitly coordinating infrastructure changes.
- Prefer referencing README sections instead of recreating documentation in pull requests.
