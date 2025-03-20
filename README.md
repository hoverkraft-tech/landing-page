<h1 align="center">Welcome to @hoverkraft/landing-page 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a title="Read documentation" href="https://github.com/hoverkraft-tech/landing-page#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a title="View repository activity" href="https://github.com/hoverkraft-tech/landing-page/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
</p>

> Landing page for Hoverkraft Organization

## 🏠 [Homepage](https://hoverkraft.cloud)

## Development

2. **Install dependencies:**

```shell
npm install
```

3. **Start the development server:**

```shell
npm run dev
```

4. **Open your browser and visit [http://localhost:4321](http://localhost:4321)**

5. **Start customizing your site!**

---

## 📚 Documentation

1. Project structure
2. Built-in components
3. Theme customization

### 1. 📂 Project Structure

The project structure is designed to be easy to understand and navigate. Here's a quick overview of the directories and files you'll find in this project:

```
/
├── public/             # Static assets (images, icons, etc.)
├── src/
│   └── config/         # Site configuration
│       └── config.json # Top-level site configuration, like title, description, metas, some astro settings, etc.
│       └── menu.json   # Configure the site visible navigation in header and footer
│       └── social.json # Social links and icons
│       └── theme.json  # Your theme names and font settings (used in tailwind.config.js, related to styles/theme.css)
│   ├── content/        # Markdown and mdx files for dynamic content following the Astro conventions (see below)
│   ├── components/     # Reusable components
│       └── react/      # React components
│   ├── layouts/        # Astro Reutilizable Layout components
│   ├── pages/          # Site pages (follows Astro conventions)
│   ├── styles/         # Global and component-specific styles
├── astro.config.mjs    # Astro configuration
├── tailwind.config.js  # TailwindCSS configuration
├── package.json        # No need to explain
└── [editor cfg files]  # Project dependencies and scripts
```

### 2. 🧩 Built-in Components

The starter comes with a set of components that you can use to build your site basic structure.
Ideally, you should use them as a starting point and modify them to fit your needs.

There's only a few of them that are considered **core and generic**:

```
/
├── components/
│   └── Logo.astro      # The site logo. Reused across the site, every page has it.
│   └── Section.astro   # A section with a title, content and an optional image. Is a standard content block that every page has.
└── └── PageHeader.astro # Used to display the page title and description, intended to bind with the page `mdx` data.

```

Every other component is considered **specific** and is used in the demo site. You can use them as inspiration or modify them to fit your needs.

### 3. 🎨 Theme Customization

The starter comes with a default theme that you can customize to fit your needs.
There's 3 files involved in the theme customization:

```
/
├── src/
│   └── styles/
│       └── theme.css    # The main theme file, where you can define your colors.
│   └── config/
│       └── theme.json    # A JSON file used for theme domain names and font settings. Define your theme color names and font settings here.
├── tailwind.config.js   # The tailwind configuration file, you know what it is, the other two files are used here.
```
 
## 🧞 Commands (by Astro)

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |


## Author

👤 **Hoverkraft <contact@hoverkraft.cloud>**

- Website: <https://hoverkraft.cloud>
- Github: [@hoverkraft](https://github.com/hoverkraft-tech)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/hoverkraft-tech/landing-page/issues). You can also take a look at the [contributing guide](https://github.com/hoverkraft-tech/landing-page/blob/main/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Hoverkraft <contact@hoverkraft.cloud>](https://github.com/hoverkraft).<br />
This project is [0BSD](https://github.com/hoverkraft/landing-page/blob/main/LICENSE) licensed.