# ICHU — Website

Static website for ICHU, a Peruvian livestock technology platform. Built with semantic HTML, CSS, and vanilla JavaScript, with no build step.

## Structure

```text
.
├── index.html                 # Home page
├── media.html                 # Media page
├── como-funciona.html         # Product walkthrough
├── assets/
│   ├── images/                # Images and brand assets
│   ├── scripts/               # Shared fragments language and interactions
│   ├── styles/                # Site styles
│   └── videos/                # Product videos
├── partials/
│   ├── _header.html           # Shared header and mobile navigation
│   └── _footer.html           # Shared footer
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
| `como-funciona.html` | Record, monitor, and decide |

Pages remain at the site root so static hosting can serve `index.html` directly. The shared header and footer are stored in `partials/` and loaded with `fetch` by `assets/scripts/partials.js`.

## Features

- Light and dark themes persisted in `localStorage`.
- Spanish and English through the dictionary in `assets/scripts/i18n.js`.
- Responsive navigation, accessible submenus, and dismissal with Escape.
- Demonstration request form and simulated chat.
- Animations and counters that respect `prefers-reduced-motion`.
- Collar video playback only when its section is visible in night mode.

## Deployment

Publish this folder as the root of the static website. The published directory must contain `index.html`, `assets/`, and `partials/` at the same level.
