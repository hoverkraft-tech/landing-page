# CI reports

The website and its GitHub Actions run their own checks and validate native
reports before retaining them. The website's Vitest JSON report includes test
results and coverage. Each action package keeps separate test and coverage
results, so the consolidated report identifies which component needs attention.

One `reports` job waits for repository lint, the website and action packages. It
publishes annotations, a summary with expandable details, and one updated PR
comment. Coverage uses GitHub Code Quality when available, with the comment as
fallback. Packages do not publish competing comments.

The separate `CI complete` job waits for every required CI job and reporting.
It fails on failed, cancelled or unexpectedly skipped jobs. Report publication
can succeed while reporting failed tests; the producer and `CI complete` remain
failed. Require `CI complete` for merging instead of treating the reporting
workflow as the overall CI verdict.

When adding a required CI job, include it in the dependencies of both `reports`
and `complete` in [shared CI](../../.github/workflows/__shared-ci.yml).
