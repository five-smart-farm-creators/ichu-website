# Changelog

This file records notable changes to the ICHU website.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Changes are collected under Unreleased until a release is tagged.

## Unreleased

## [0.1.1] - 2026-11-14

### Fixed

- GitHub Pages publishes shared fragments with underscore-prefixed filenames, restoring the header, footer, logos, and icon initialization.
- The recovery page resolves styles, scripts, images, and navigation under the GitHub Pages project path, including nested missing URLs.

## [0.1.0] - 2026-11-07

### Added

- English and Spanish translations with a saved language preference.
- A localized 404 page with recovery navigation and theme controls.
- Contributor guidance and a proprietary license.
- Commit message hook and Git Flow pull request checks to enforce branch and Conventional Commits conventions.
- Git mailmap to unify contributor identities.

### Changed

- The 404 page reuses the shared navigation, footer, controls, and stylesheet.
- Page interactions use feature initializers and shared animation, overlay, and chat helpers.
- Shared fragment links resolve from the site root on nested recovery routes.
- English is the default language, with Spanish available through the language selector.
- Translation resources use nested semantic keys in the root `locales/` directory.
- Displayed times and numbers follow the selected locale.
- Contribution guide aligned with the team's Git Flow, Conventional Commits and Semantic Versioning conventions.

### Removed

- Spanish copies of the repository guides and the `readme/` directory.
- The custom locale validation script and its GitHub Actions workflow.

### Fixed

- Shared header and footer fragments resolve from the page deployment path.
- Page content remains visible when shared fragments, translations, or scripts fail to initialize.
- The mobile contact action closes the menu and restores page scrolling.
- Chat suggestions receive replies for their selected topic, including IoT sensors.
- Phone validation rejects values without enough digits while accepting common separators.
- Narrow screens no longer show horizontal overflow in the audience sections.
- The walkthrough and media pages have main headings with their existing appearance.
- Translations load correctly on standalone pages and nested recovery URLs.
- Every page includes a keywords meta tag for search engines.
