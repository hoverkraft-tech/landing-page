# Blog automation

Configure `BLOG_CONTENT_OPENAI_API_KEY` as a repository Actions secret in
`hoverkraft-tech/landing-page`. Its value is a dedicated OpenAI API key with access
to the text and image models used by the blog actions.

The credential is used by two workflows:

- [Generate Release Blog Post](../../.github/workflows/generate-release-blog-post.yml)
  creates bilingual release posts and preview images.
- [Share new blog posts](../../.github/workflows/share-new-blog-posts.yml) creates
  social snippets and publishes them through Postiz.

For social sharing, also configure the `POSTIZ_API_KEY` Actions secret and the
`POSTIZ_API_URL` and `POSTIZ_INTEGRATIONS` repository variables. Main CI passes both
required secrets explicitly when it calls the sharing workflow after deployment.

Provision `BLOG_CONTENT_OPENAI_API_KEY` before running either workflow. A missing
credential fails the action. The actions receive the credential through their
`openai-api-key` input; their internal `OPENAI_API_KEY` environment variable does
not select a GitHub secret.

GitHub release summaries use the organization's separate `CHANGELOG_SUMMARY`
secret through the [release workflow](../../.github/workflows/release.yml).

## Preview images

Release previews use the generated English post (including repository descriptions
and release highlights) as context for one scene shared by both locales. The topic
is the main subject; the Hoverkraft mascot performs a related action with its claw.

The action reads the [shared image prompt](../../.github/agents/blog-post-image-preview.prompt.md)
and uploads the checked-in mascot and HK logo from `application/src/assets/images/brand/`
as references to OpenAI's Image Edits API. Keep those assets available under the
action's `output-dir`. Missing references or image API failures fail generation.
The request uses a transparent PNG background at 1536x1024.

Use the same prompt for [manual previews](../../.github/agents/blog-post-image-preview.md).
Review the generated image for mascot identity, a visible connection to the post,
brand colors, transparency, and readability at social-preview crop sizes. Prompt
and reference checks cannot guarantee the visual quality of a generated image.
