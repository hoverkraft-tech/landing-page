<!-- header:start -->

# GitHub Action: Share posts via Postiz

<div align="center">
  <img src="https://opengraph.githubassets.com/a17d20276590714a95f563f7eb6a553c6afc859c63dff12be4788bdda2da1bfd/hoverkraft-tech/landing-page" width="60px" align="center" alt="Share posts via Postiz" />
</div>

---

<!-- header:end -->
<!-- badges:start -->

[![Marketplace](https://img.shields.io/badge/Marketplace-share--posts--via--postiz-blue?logo=github-actions)](https://github.com/marketplace/actions/share-posts-via-postiz)
[![Release](https://img.shields.io/github/v/release/hoverkraft-tech/landing-page)](https://github.com/hoverkraft-tech/landing-page/releases)
[![License](https://img.shields.io/github/license/hoverkraft-tech/landing-page)](http://choosealicense.com/licenses/mit/)
[![Stars](https://img.shields.io/github/stars/hoverkraft-tech/landing-page?style=social)](https://img.shields.io/github/stars/hoverkraft-tech/landing-page?style=social)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/hoverkraft-tech/landing-page/blob/main/CONTRIBUTING.md)

<!-- badges:end -->
<!-- overview:start -->

## Overview

Publish blog posts to social networks via Postiz using OpenAI for snippets.

<!-- overview:end -->
<!-- usage:start -->

## Usage

````yaml
- uses: hoverkraft-tech/landing-page/.github/actions/share-blog-post@c83355f5e435231ea4abbc2364aedeba97e58741 # 2.2.1
  with:
    # Newline-separated list of post folder names to share
    # This input is required.
    posts: ""

    # Language for the generated social post (e.g. 'en', 'fr')
    # This input is required.
    language: ""

    # Site base URL
    # This input is required.
    site-base-url: ""

    # Blog base path
    # This input is required.
    blog-base-path: ""

    # Postiz API key
    # This input is required.
    postiz-api-key: ""

    # Postiz API base URL (e.g. https://api.postiz.com)
    # This input is required.
    postiz-api-url: ""

    # JSON object mapping Postiz platform -> Postiz integration ID.
    # See https://docs.postiz.com/public-api/posts/create#all-27-supported-platforms.
    # Example:
    #
    # ```json
    # { "bluesky": "xyz" }
    # ```
    #
    # This input is required.
    postiz-integrations: ""

    # OpenAI API key
    # This input is required.
    openai-api-key: ""
````

<!-- usage:end -->
<!-- inputs:start -->

## Inputs

| **Input**                 | **Description**                                                                              | **Required** | **Default** |
| ------------------------- | -------------------------------------------------------------------------------------------- | ------------ | ----------- |
| **`posts`**               | Newline-separated list of post folder names to share                                         | **true**     | -           |
| **`language`**            | Language for the generated social post (e.g. 'en', 'fr')                                     | **true**     | -           |
| **`site-base-url`**       | Site base URL                                                                                | **true**     | -           |
| **`blog-base-path`**      | Blog base path                                                                               | **true**     | -           |
| **`postiz-api-key`**      | Postiz API key                                                                               | **true**     | -           |
| **`postiz-api-url`**      | Postiz API base URL (e.g. <https://api.postiz.com>)                                          | **true**     | -           |
| **`postiz-integrations`** | JSON object mapping Postiz platform -> Postiz integration ID.                                | **true**     | -           |
|                           | See <https://docs.postiz.com/public-api/posts/create#all-27-supported-platforms>.            |              |             |
|                           | Example:                                                                                     |              |             |
|                           |                                                                                              |              |             |
|                           | <!-- textlint-disable --><pre lang="json">{ "bluesky": "xyz" }</pre><!-- textlint-enable --> |              |             |
| **`openai-api-key`**      | OpenAI API key                                                                               | **true**     | -           |

<!-- inputs:end -->
<!-- secrets:start -->
<!-- secrets:end -->
<!-- outputs:start -->
<!-- outputs:end -->
<!-- examples:start -->
<!-- examples:end -->
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

Copyright © 2026 hoverkraft-tech

For more details, see the [license](http://choosealicense.com/licenses/mit/).

<!-- license:end -->
<!-- generated:start -->

---

This documentation was automatically generated by [CI Dokumentor](https://github.com/hoverkraft-tech/ci-dokumentor).

<!-- generated:end -->
