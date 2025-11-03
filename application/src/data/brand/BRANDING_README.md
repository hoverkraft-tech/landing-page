# Branding Assets Management

This document explains how branding assets are managed in the Hoverkraft landing page and how to integrate with the official @hoverkraft-tech/branding repository.

## Overview

The landing page sources brand identity assets (logos, colors, typography tokens) from a centralized branding repository at https://github.com/hoverkraft-tech/branding to ensure consistency across all Hoverkraft properties. Currently, branding data is maintained locally in this repository, but the architecture is designed to fetch assets from the branding repository at build time.

## Current Architecture

### Brand Data Structure

Brand tokens and assets are organized in:

```
application/src/data/brand/
├── tokens.ts              # Color palette, typography, logo metadata
└── BRANDING_README.md     # This file (future: from branding repo)

application/src/assets/images/
└── logo.png              # Current logo asset
```

### Brand Guidelines Pages

Two localized pages display the brand guidelines:

- `/charte-graphique` (French)
- `/en/brand-guidelines` (English)

These pages are built from:

- `application/src/pages/charte-graphique.astro`
- `application/src/pages/en/brand-guidelines.astro`

## Automated Asset Fetching

The branding repository exists at https://github.com/hoverkraft-tech/branding. The CI/CD pipeline will automatically fetch assets at build time using the workflow defined in `.github/workflows/fetch-branding-assets.yml`.

### Workflow Behavior

1. **Pre-build step**: The workflow checks if the branding repository is accessible
2. **Fetch**: Clones the repository at a specified ref (tag/branch/commit)
3. **Copy**: Extracts tokens and assets into the landing page structure
4. **Validate**: Ensures required assets are present before proceeding with build
5. **Artifact**: Uploads fetched assets for use by the build job

### Repository Access

The branding repository may be private. To enable the workflow to access it:

- The workflow uses `${{ github.token }}` which provides read access to repositories in the same organization
- For private repositories, ensure the workflow has the necessary permissions via repository settings
- The `GH_TOKEN` environment variable is automatically configured in GitHub Actions

### Configuration

The workflow accepts these inputs:

- `branding-repo` (default: `hoverkraft-tech/branding`): Repository to fetch from
- `branding-ref` (default: `main`): Git ref to checkout (use tags for version pinning)
- `target-dir` (default: `application/src/data/brand`): Where to place fetched data

### Expected Branding Repository Structure

The workflow expects the branding repository to follow this structure:

```
hoverkraft-tech/branding/
├── tokens/                 # Design tokens (JSON/YAML)
│   ├── colors.json
│   ├── typography.json
│   └── spacing.json
├── assets/                # Logo files, icons, patterns
│   ├── logos/
│   │   ├── logo.svg
│   │   ├── logo.png
│   │   ├── logo-alt.svg
│   │   └── logo-dark.svg
│   └── icons/
└── README.md             # Usage guidelines and documentation
```

## Manual Update Process (Current)

Until the branding repository integration is fully enabled in the CI/CD pipeline, update brand assets manually:

### 1. Update Brand Tokens

Edit `application/src/data/brand/tokens.ts`:

```typescript
export const brandColors: ColorToken[] = [
  {
    name: 'Primary Blue',
    hex: '#1E3A8A',
    rgb: '30, 58, 138',
    usage: 'Primary brand color, main CTAs, key UI elements',
  },
  // Add or modify colors here
];
```

### 2. Update Logo Assets

Place new logo files in `application/src/assets/images/` and update the logo metadata in `tokens.ts`:

```typescript
export const logos: LogoAsset[] = [
  {
    name: 'Primary Logo',
    path: '~/assets/images/logo.png', // Update path if needed
    formats: ['PNG', 'SVG'],
    usage: 'Main logo for light backgrounds',
    minimumSize: '120px width',
    clearSpace: '20px on all sides',
  },
];
```

### 3. Test Changes

```bash
make build    # Verify build succeeds
make start    # Test pages locally
```

Visit:

- <http://localhost:4321/charte-graphique> (French)
- <http://localhost:4321/en/brand-guidelines> (English)

## Automated Update Process

The branding repository workflow integration:

### 1. Branding Repository Workflow

The branding team maintains assets in https://github.com/hoverkraft-tech/branding. When they release a new version:

1. Update tokens/assets in the branding repository
2. Create a Git tag (e.g., `v1.2.0`)
3. Push changes and tag to GitHub

### 2. Landing Page Integration

To integrate a new branding version:

**Option A: Update default ref in workflow**

Edit `.github/workflows/fetch-branding-assets.yml`:

```yaml
branding-ref:
  default: 'v1.2.0'  # Pin to specific tag
```

**Option B: Override at workflow call**

In your CI workflow (e.g., `__shared-ci.yml`), call the fetch workflow:

```yaml
jobs:
  fetch-branding:
    uses: ./.github/workflows/fetch-branding-assets.yml
    with:
      branding-ref: 'v1.2.0'  # Specify version
  
  build:
    needs: fetch-branding
    # ... build steps
```

### 3. Automatic Validation

The workflow validates that required assets are present. If validation fails, the build will not proceed, preventing deployment with incomplete branding.

## Asset Presence Validation

The CI workflow includes validation checks to ensure all required brand assets are present before building. Add custom validation rules in `.github/workflows/fetch-branding-assets.yml`:

```bash
# Check for required files
if [ ! -f "$TARGET_DIR/tokens/colors.json" ]; then
  echo "::error::Missing required file: tokens/colors.json"
  exit 1
fi
```

## Migration Path

### Phase 1: Current State ✅

- Brand tokens defined in `application/src/data/brand/tokens.ts`
- Brand guidelines pages created
- Manual updates as needed
- Branding repository exists at https://github.com/hoverkraft-tech/branding

### Phase 2: Repository Structure Alignment

1. Verify the branding repository structure matches expected format
2. Migrate current tokens from `tokens.ts` to the branding repository if needed
3. Organize assets following the expected structure
4. Document usage guidelines in branding repository README

### Phase 3: Automated Fetching

1. Enable the fetch-branding-assets workflow in CI
2. Update landing page to use fetched assets instead of local tokens
3. Remove hardcoded tokens from landing page (keep as fallback)
4. Add tests to verify asset integrity

### Phase 4: Continuous Updates

1. Branding team manages assets in central repository
2. Landing page automatically picks up changes on next build
3. Version pinning via Git tags ensures controlled updates

## Troubleshooting

### Build fails with missing assets

If the branding repository is unavailable or validation fails:

1. Check workflow logs in GitHub Actions
2. Verify the branding repository is accessible (may be private)
3. Ensure the workflow has proper permissions to access the repository
4. Ensure the specified `branding-ref` exists in the repository
5. Check that required assets are present in the branding repository

### Repository Access Issues

If the workflow cannot access the branding repository:

1. Verify that the repository exists at https://github.com/hoverkraft-tech/branding
2. Check if the repository is private and requires authentication
3. Ensure `GH_TOKEN` has read access to the branding repository
4. For cross-organization access, you may need a Personal Access Token (PAT)

### Local development without branding repository

The pages will work with the fallback tokens defined in `tokens.ts`. No action needed for local development.

## Contact

For questions about branding assets or to request specific assets:

- Email: brand@hoverkraft.cloud
- GitHub: @hoverkraft-tech
- Branding Repository: https://github.com/hoverkraft-tech/branding

---

**Note**: The branding repository exists at https://github.com/hoverkraft-tech/branding. The CI/CD workflow is ready to fetch assets once the integration is enabled.

---

**Note**: This document will be updated when the `hoverkraft-tech/branding` repository becomes available.
