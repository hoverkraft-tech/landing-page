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
