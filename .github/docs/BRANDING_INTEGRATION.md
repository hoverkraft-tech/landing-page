# Branding Repository Integration Architecture

This document describes the repository dispatch pattern used to integrate branding assets from `@hoverkraft-tech/branding` into the landing page.

## Architecture Overview

The integration follows a **repository dispatch pattern** with clear separation of concerns:

```
┌─────────────────────────────────┐
│  hoverkraft-tech/branding       │
│  (Source of Truth)              │
│                                 │
│  1. Prepare branding data       │
│  2. Package as artifact         │
│  3. Create manifest             │
│  4. Dispatch to landing-page    │
└────────────┬────────────────────┘
             │ repository_dispatch
             │ (manifest + artifact_id)
             ▼
┌─────────────────────────────────┐
│  hoverkraft-tech/landing-page   │
│  (Consumer)                     │
│                                 │
│  1. Receive dispatch event      │
│  2. Validate manifest           │
│  3. Download artifact           │
│  4. Process & update assets     │
│  5. Commit changes              │
└─────────────────────────────────┘
```

## Contract Interface

The two repositories communicate via a JSON manifest that defines the structure and metadata of the branding data. This contract is defined in `.github/schemas/branding-manifest.schema.json`.

### Manifest Structure

```json
{
  "version": "1.0.0",
  "timestamp": "2025-11-03T22:00:00Z",
  "commit": "abc123...",
  "colors": {
    "file": "colors.css",
    "count": 6
  },
  "logos": {
    "directory": "logo",
    "files": [
      {
        "name": "Primary Logo",
        "path": "logo/primary.svg",
        "format": "svg",
        "size": 12345,
        "usage": "Main logo for light backgrounds"
      }
    ]
  },
  "mascot": {
    "file": "mascot/mascot.png",
    "size": 54321
  },
  "fonts": {
    "primary": {
      "family": "Inter Variable",
      "weights": [300, 400, 500, 600, 700, 800],
      "fallback": "system-ui, sans-serif"
    }
  }
}
```

## Branding Repository Responsibilities

The `hoverkraft-tech/branding` repository is responsible for:

### 1. Data Preparation (on push to main)

When changes are pushed to the main branch, the branding repository workflow should:

- Validate all branding assets
- Generate/prepare the manifest JSON
- Package all assets into a GitHub Actions artifact
- Include the manifest in the artifact

### 2. Repository Dispatch

After preparing the data, trigger a repository dispatch to `hoverkraft-tech/landing-page`:

```yaml
- name: Dispatch to landing-page
  uses: peter-evans/repository-dispatch@v2
  with:
    token: ${{ secrets.DISPATCH_TOKEN }}
    repository: hoverkraft-tech/landing-page
    event-type: branding-update
    client-payload: |
      {
        "manifest": ${{ steps.generate-manifest.outputs.manifest }},
        "artifact_id": ${{ github.run_id }}
      }
```

### Example Branding Workflow

```yaml
name: Prepare and Dispatch Branding

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  prepare-branding:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate manifest
        id: manifest
        run: |
          # Create manifest.json with metadata
          cat > manifest.json << EOF
          {
            "version": "1.0.0",
            "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
            "commit": "${{ github.sha }}",
            "colors": {
              "file": "colors.css",
              "count": $(grep -c "^--" colors.css)
            },
            "logos": {
              "directory": "logo",
              "files": $(jq -n '[]')  # Generate from logo files
            }
          }
          EOF
          
          echo "manifest=$(cat manifest.json | jq -c)" >> $GITHUB_OUTPUT
      
      - name: Upload branding artifact
        uses: actions/upload-artifact@v4
        with:
          name: branding-assets-${{ github.run_id }}
          path: |
            colors.css
            logo/
            mascot/
            manifest.json
          retention-days: 30
      
      - name: Dispatch to landing-page
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.DISPATCH_TOKEN }}
          repository: hoverkraft-tech/landing-page
          event-type: branding-update
          client-payload: |
            {
              "manifest": ${{ steps.manifest.outputs.manifest }},
              "artifact_id": "${{ github.run_id }}"
            }
```

## Landing Page Responsibilities

The `hoverkraft-tech/landing-page` repository handles incoming dispatch events:

### 1. Event Reception

The workflow `.github/workflows/update-branding-assets.yml` is triggered by:
- `repository_dispatch` events with type `branding-update`
- Manual `workflow_dispatch` (for testing)

### 2. Manifest Validation

The received manifest is validated against the JSON schema to ensure contract compliance:

```bash
ajv validate -s .github/schemas/branding-manifest.schema.json -d manifest.json
```

### 3. Artifact Download

Download the artifact from the branding repository using the provided artifact ID:

```yaml
- uses: actions/download-artifact@v4
  with:
    name: branding-assets-${{ artifact_id }}
    repository: hoverkraft-tech/branding
    run-id: ${{ artifact_id }}
```

### 4. Asset Processing

Process the downloaded assets:
- Extract colors from `colors.css` → TypeScript tokens
- Copy logo files to `public/brand/logos/`
- Copy mascot to `public/brand/mascot/`
- Generate logo pack ZIP
- Generate brand guidelines PDF

### 5. Commit Changes

Automatically commit the updated assets to the repository:

```bash
git add application/public/brand/
git commit -m "chore: update branding assets to version X.Y.Z"
git push
```

## Benefits of This Architecture

### Clear Separation of Concerns
- **Branding repo**: Source of truth, data preparation
- **Landing page repo**: Consumer, asset processing, presentation

### Contract-Based Integration
- JSON schema ensures type safety and validation
- Changes to the contract are explicit and versioned
- Both repos know exactly what to expect

### Versioning & Traceability
- Each update includes version, commit SHA, and timestamp
- Easy to track which branding version is deployed
- Rollback capability via version pinning

### Robust Error Handling
- Manifest validation catches malformed data early
- Missing assets are detected before deployment
- Failed updates don't break the site (fallback assets)

### Automation
- No manual intervention required
- Updates propagate automatically from branding to landing page
- Consistent process every time

## Trigger Conditions

The branding repository dispatches updates:

### Automatic Triggers
- **On push to main**: Every commit to the main branch triggers an update
- Ensures landing page always has the latest branding

### Manual Triggers
- **workflow_dispatch**: Manual trigger for testing or specific updates
- Useful for preview/testing before merging

## Testing

### Testing the Integration

1. **In branding repository**:
   ```bash
   # Manually trigger the workflow
   gh workflow run prepare-branding.yml
   ```

2. **In landing-page repository**:
   ```bash
   # Test with mock data
   gh workflow run update-branding-assets.yml \
     --field artifact-id="12345" \
     --field manifest='{"version":"1.0.0",...}'
   ```

### Validation Steps

1. ✅ Manifest passes JSON schema validation
2. ✅ Artifact download succeeds
3. ✅ All required files present in artifact
4. ✅ Asset processing completes without errors
5. ✅ Generated assets (ZIP, PDF) created successfully
6. ✅ Changes committed to repository

## Rollback Procedure

If an update causes issues:

1. Identify the previous working version from git history
2. Revert the branding update commit:
   ```bash
   git revert <commit-sha>
   git push
   ```
3. The site will use the previous branding assets

## Monitoring

Monitor the integration via:
- GitHub Actions workflow runs
- Git commit history (all updates tracked)
- Workflow summary (shows version, commit, assets updated)

## Future Enhancements

Potential improvements to the architecture:

1. **Preview Deployments**: Deploy to preview environment before merging
2. **Changelog Generation**: Automatically generate changelog from manifest
3. **Asset Optimization**: Optimize images during processing
4. **CDN Upload**: Upload assets to CDN for faster delivery
5. **Notifications**: Slack/email notifications on successful updates

## Security Considerations

- **Authentication**: Uses `GITHUB_TOKEN` with appropriate permissions
- **Validation**: All input validated against schema
- **Artifact Retention**: Artifacts retained for 30 days for rollback
- **Commit Signing**: Consider enabling commit signing for traceability

## Support

For issues or questions:
- **Branding data issues**: Create issue in `hoverkraft-tech/branding`
- **Integration issues**: Create issue in `hoverkraft-tech/landing-page`
- **Contract changes**: Discuss in both repositories

---

**Last Updated**: 2025-11-03
**Schema Version**: 1.0.0
