<!-- header:start -->

# GitHub Workflow: Update Branding Assets

<div align="center">
  <img src="https://opengraph.githubassets.com/4d323a54472c116885e8e38830d1b3720730106f2f3e1c9f3fac91df204c5117/hoverkraft-tech/landing-page" width="60px" align="center" alt="Update Branding Assets" />
</div>

---

<!-- header:end -->
<!-- badges:start -->

[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/landing-page)](https://github.com/hoverkraft-tech/landing-page/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/landing-page)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/landing-page?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/landing-page?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/landing-page/blob/main/CONTRIBUTING.md)

<!-- badges:end -->
<!-- overview:start -->

## Overview

Workflow to update branding assets in the landing-page repository upon receiving a dispatch event from the branding repository.

- Branding repository packages validated assets, emits manifest, and dispatches `branding-update` with `artifact_id` matching the GitHub run ID.
- Landing-page workflow validates the manifest, downloads `branding-assets-<run_id>` from `hoverkraft-tech/branding`, and refreshes assets plus derived outputs (logo ZIP, brand guide PDF).

Manifest fields capture version metadata, color tokens, logo inventory, mascot path, and typography tokens and must satisfy `.github/schemas/branding-manifest.schema.json`.

### Permissions

- **`contents`**: `read`

<!-- overview:end -->

## Workflow Responsibilities

- **Branding repository**: keep manifest accurate, bundle every referenced asset, trigger dispatch on `main` and manual runs.
- **Landing-page repository**: enforce schema validation, safely handle missing files, commit processed assets under `application/public/brand/` with manifest version in the message.

## Validation & Testing

- `ajv validate -s .github/schemas/branding-manifest.schema.json -d manifest.json` before dispatching real updates.
- `gh workflow run update-branding-assets.yml --field artifact-id="12345" --field manifest='{"version":"1.0.0"}'` to dry-run the consumer pipeline.
- Run `npm run lint` and `npm run build` (or `make lint` / `make build`) after asset refreshes.

## Rollback & Monitoring

- Revert the branding update commit to roll back to the previous asset set.
- Monitor GitHub Actions runs and commit history; artifacts remain available for 30 days for reprocessing.

<!-- usage:start -->

## Usage

```yaml
name: Update Branding Assets
on:
  repository_dispatch:
    types:
      - branding-update
permissions: {}
jobs:
  update-branding-assets:
    uses: hoverkraft-tech/landing-page/.github/workflows/update-branding-assets.yml@c83355f5e435231ea4abbc2364aedeba97e58741 # 2.2.1
    permissions: {}
    with:
      # The repository where to download the branding artifact from
      # This input is required.
      repository: ""

      # The run ID from the branding repository
      # This input is required.
      run-id: ""

      # The artifact ID from the branding repository
      # This input is required.
      artifact-id: ""

      # JSON manifest describing the branding data
      #
      # This input is required.
      manifest: ""
```

<!-- usage:end -->
<!-- inputs:start -->

## Inputs

### Workflow Dispatch Inputs

| **Input**         | **Description**                                             | **Required** | **Type**   | **Default** |
| ----------------- | ----------------------------------------------------------- | ------------ | ---------- | ----------- |
| **`repository`**  | The repository where to download the branding artifact from | **true**     | **string** | -           |
| **`run-id`**      | The run ID from the branding repository                     | **true**     | **string** | -           |
| **`artifact-id`** | The artifact ID from the branding repository                | **true**     | **string** | -           |
| **`manifest`**    | JSON manifest describing the branding data                  | **true**     | **string** | -           |

<!-- inputs:end -->
<!-- secrets:start -->
<!-- secrets:end -->
<!-- outputs:start -->
<!-- outputs:end -->
<!-- examples:start -->
<!-- examples:end -->
<!--
// jscpd:ignore-start
-->
<!-- contributing:start -->

## Contributing

Contributions are welcome! Please see the [contributing guidelines](https://github.com/hoverkraft-tech/landing-page/blob/main/CONTRIBUTING.md) for more details.

<!-- contributing:end -->
<!-- security:start -->
<!-- security:end -->
<!-- license:start -->

## License

This project is licensed under the MIT License.

SPDX-License-Identifier: MIT

Copyright © 2025 hoverkraft-tech

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->
<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->
<!--
// jscpd:ignore-end
-->
