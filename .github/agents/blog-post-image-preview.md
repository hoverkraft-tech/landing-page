---
name: blog-post-image-preview
description: Specialized image generation skill for Hoverkraft's blog post preview images
version: "1.0.0"
parameters:
  - name: translation-key
    description: Unique identifier for the blog post (used for folder naming)
    required: true
    schema:
      type: string
  - name: topic
    description: Blog post topic or title for visual inspiration
    required: true
    schema:
      type: string
  - name: focus
    description: Main subject, metaphor, or concept to visualize
    required: true
    schema:
      type: string
  - name: style-hints
    description: Optional additional style guidance or specific visual elements
    required: false
    schema:
      type: string
tools:
  - bash
  - view
  - create
  - image-generator-gpt-image/image.generate.openai
mcp-servers:
  image-generator-gpt-image:
    type: "local"
    command: "npx"
    args: ["-y", "imagegen-mcp-server"]
    tools: ["image.generate.openai"]
    env:
      "OPENAI_API_KEY": "OPENAI_API_KEY"
      "OPENAI_IMAGE_MODEL": "gpt-image-2"
---

# Blog Post Image Preview Skill

Follow [../../AGENTS.md](../../AGENTS.md) before working in this repository. Create brand-aligned, mascot-led social preview images with a transparent background for Hoverkraft blog posts using the steps below. The post topic is always the visual hero; the Hoverkraft mascot appears only as a small secondary character shown in action.

## Steps

1. Confirm required inputs are provided (`translation-key`, `topic`, `focus`, optional `style-hints`) and choose the key visual metaphor.
2. Create the output directory before generation:
   ```bash
   mkdir -p application/src/assets/images/blog/{translation-key}
   ```
3. Generate the required preview image (`preview.png`, 1536x1024, <=2MB) using
   [the shared prompt](./blog-post-image-preview.prompt.md), which is also read by
   the automated release generator. Append the post's title, summary, and concrete
   content or release highlights as context, plus the requested focus and style hints.
   Always attach `application/src/assets/images/brand/mascot/mascot.png` as image 1
   and `application/src/assets/images/brand/logo/logo-icon.png` as image 2 to
   preserve the mascot and HK chest logo. Use an image tool that supports reference
   images and transparent output; request a transparent PNG directly.
4. When requested, generate supporting visuals saved as `.webp` (~15-35KB) with descriptive kebab-case names:
   - **Architecture (1200×800)**
     ```txt
     Create a 1200x800 abstract architecture illustration showing [subject].
     Style: clean isometric shapes, high-detail digital illustration.
     Color palette: deep navy #1d2026 background, bright blue #1998ff nodes, soft white #f5f7fb surfaces, vivid orange #ff5a02 signals.
     Composition: [describe layout, balanced arrangement].
     Lighting: subtle gradients, no text, no people, no drop shadows.
     ```
   - **Chart/Dashboard (1024×1024)**
     ```txt
     Create a 1024x1024 radial chart highlighting [metric/concept].
     Style: modern dashboard visual, minimalist.
     Color palette: soft white #f5f7fb background, bright blue #1998ff primary segments, emerald #00d663 positive markers, vivid orange #ff5a02 contrast.
     Composition: centered with abstract ticks or icons (no alphanumeric text).
     Lighting: flat, clean, no noise.
     ```
   - **Workflow (1200×800 or 1024×1024)**
     ```txt
     Create a [size] workflow illustration for "[process]".
     Style: modern, geometric flow diagram with clean lines.
     Color palette: deep navy #1d2026 background, bright blue #1998ff primary elements, vivid orange #ff5a02 highlights.
     Composition: [left-to-right flow / circular / radial] with clear visual hierarchy.
     Lighting: soft glow, crisp edges, no photorealism, no text.
     ```
5. Save outputs to `application/src/assets/images/blog/{translation-key}/` as
   `preview.png` (transparent, 1536x1024) and optional supporting `.webp` files.
   Preserve the generated alpha channel when optimizing. Verify clean edges,
   readability when cropped to 1200x628, and centered focus with safe margins.
6. Apply style guardrails: the topic/concept is the hero and the mascot is a small secondary accent in action (never the centerpiece); keep the mascot's three-pronged robot claws and intact "HK" chest logo; transparent background; modern polished 3D cartoon.
   Use brand colors (bright blue #1998ff, vivid orange #ff5a02, deep navy #1d2026 for depth, soft white #f5f7fb, emerald #00d663 only for positive markers); no text, no photorealism; generate variations if needed.
7. Verify the quality checklist: correct dimensions and transparent background; topic is the visual hero with the mascot small and in action; mascot has robot claws (not hands) and a correct "HK" chest logo; clean geometric visuals with centered focus and margins; and no distorted text or faces.
8. Report results with file paths, brief descriptions, and any issues or variations.

## Example Invocation

Call the skill with:

- **translation-key**: `platform-engineering-guide`
- **topic**: "The Complete Guide to Platform Engineering"
- **focus**: "Modular platform blocks connecting developer teams"
- **style-hints**: "Show interconnected hexagons representing platform components"

Append this scene direction to the shared prompt and the post context:

```txt
Main hero (large, the centerpiece): a central cluster of interconnected glowing hexagons representing platform components, linked by flowing connectors.
Mascot action: snapping a hexagon into place with its claw.
```

## Empowered Actions

✅ Generate preview images | ✅ Generate supporting visuals | ✅ Create output directories | ✅ Iterate on image quality

❌ Don't modify blog content | ❌ Don't generate off-brand visuals | ❌ Don't make the mascot the centerpiece or give it human hands | ❌ Don't change the "HK" chest logo | ❌ Don't include text in images | ❌ Don't ship an opaque background | ❌ Don't skip the preview.png
