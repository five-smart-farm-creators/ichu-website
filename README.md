# ICHU — Website

Static website for ICHU, a Peruvian livestock technology platform. Built with semantic HTML, CSS, and vanilla JavaScript, with no build step.

## Structure

```text
.
├── index.html                 # Home page
├── media.html                 # Media page
├── how-it-works.html          # Product walkthrough
├── assets/
│   ├── images/                # Images and brand assets
│   ├── scripts/               # Shared fragments language and interactions
│   ├── styles/                # Site styles
│   └── videos/                # Product videos
├── partials/
│   ├── _header.html           # Shared header and mobile navigation
│   └── _footer.html           # Shared footer
├── public/
│   └── locales/
│       ├── en.json            # English translation resources
│       └── es.json            # Spanish translation resources
├── .editorconfig              # Encoding and indentation
├── .gitattributes             # Text and binary file normalization
├── .gitignore                 # Files excluded from version control
└── README.md
```

## Pages

| File | Content |
|---|---|
| `index.html` | ICHU home page and product sections |
| `media.html` | Platform walkthroughs and field stories |
| `how-it-works.html` | Record, monitor, and decide |

Pages remain at the site root so static hosting can serve `index.html` directly. The shared header and footer are stored in `partials/` and loaded with `fetch` by `assets/scripts/partials.js`.

## Features

- Light and dark themes persisted in `localStorage`.
- English and Spanish resources in `public/locales/en.json` and `public/locales/es.json`, managed by `assets/scripts/i18n.js`.
- Responsive navigation, accessible submenus, and dismissal with Escape.
- Demonstration request form and simulated chat.
- Animations and counters that respect `prefers-reduced-motion`.
- Collar video playback only when its section is visible in night mode.

## Deployment

Publish this folder as the root of the static website. The published directory must contain `index.html`, `assets/`, `partials/`, and `public/` at the same level. Locale files are requested from `public/locales/` relative to the page URL. This project has no build step that copies the contents of `public/` to the site root.

## Internationalization

English is the default language. Spanish is loaded when selected, and the saved preference is applied on subsequent visits. Both locale files use matching message keys and contain their language identifier, messages, and chat keywords. Keep message keys and interpolation placeholders consistent when adding or editing translations.

The language controller loads and caches JSON resources, updates page text and metadata, and sets the HTML language attribute. Missing translations fall back to English and then to the English source text. If the selected locale cannot be loaded, the current language remains available and the next selection retries the request.

The controller uses text nodes for translated content and preserves user entered text. Translation values must remain plain text. No additional internationalization dependency is required for the current feature set.

The resource directory is a project convention. Its name is not prescribed by HTML or W3C. The implementation follows language declaration and fallback guidance from these primary sources:

- https://www.w3.org/International/questions/qa-html-language-declarations.html
- https://www.i18next.com/principles/fallback
- https://github.com/i18next/i18next-http-backend
