# Contributing to ICHU Website

Thanks for your interest in improving ICHU. We welcome focused fixes, accessibility improvements, and documentation updates. Discuss larger changes in an [issue](https://github.com/five-smart-farm-creators/ichu-website/issues) first.

## Skills

Choose work that fits your experience. Useful skills for this project include:

- Semantic HTML and accessible navigation, forms, and page structure.
- Responsive CSS and extending an existing visual system.
- Vanilla JavaScript, browser APIs, DOM events, asynchronous requests, and safe form handling.
- Git and GitHub branches, commits, pull requests, and code review.
- Basic JSON and localization concepts for work involving translated content.

This is a static website. No framework, package installation, or build step is required. Use the [README](README.md#run-locally) to preview it locally.

## Project structure

```text
ichu-website/
├── index.html
├── how-it-works.html
├── media.html
├── 404.html
├── assets/
│   ├── scripts/
│   ├── styles/
│   ├── images/
│   └── videos/
├── partials/
│   ├── _header.html
│   └── _footer.html
├── locales/
│   ├── en.json
│   └── es.json
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE.md
```

Keep HTML pages at the repository root. Put scripts in `assets/scripts/`, styles in `assets/styles/`, images in `assets/images/`, videos in `assets/videos/`, shared fragments in `partials/`, and translations in `locales/en.json` and `locales/es.json`. Do not create directories unless the user explicitly asks for them.

## Gitflow workflow

`main` contains published releases, while `develop` integrates planned work. Start routine changes from an updated `develop` branch and use a short, lowercase English branch name with hyphens. Do not commit directly to `main` or `develop`, or force-push shared branches.

| Branch | Start from | Pull request target |
| --- | --- | --- |
| `feature/`, `fix/`, `docs/`, `refactor/`, `chore/` | `develop` | `develop` |
| `release/<version>` | `develop` | `main` and `develop` |
| `hotfix/<description>` | `main` | `main` and `develop` |

For example, create a feature branch with:

```sh
git fetch origin --prune
git switch develop
git pull --ff-only origin develop
git switch -c feature/improve-navigation
```

Before publishing, fetch and merge the latest base branch. Resolve conflicts while preserving both sides' intended changes.

## Code quality and reuse

Keep changes clean, readable, and consistent with existing project patterns.

- Look for existing JavaScript helpers, components, CSS classes, and design tokens before adding new ones. Extend or reuse them when they fit.
- Avoid duplicate logic, markup, or styles; unused code; unnecessary dependencies; and layers of CSS overrides.
- Keep functions focused and CSS rules organized. Optimize when there is a clear need, while keeping the solution straightforward to maintain.
- Keep translations in `locales/en.json` and `locales/es.json` with nested semantic camelCase keys and matching key trees and placeholders. Preserve English as the default, Spanish support, and the saved language preference; format dates and numbers with `Intl`.
- Write source code and comments in English; Spanish text belongs in `locales/es.json`. Use `//` and `/* ... */` for JavaScript comments, add HTML comments only when useful, and do not add CSS comments.
- Preserve the existing visual system, responsive behavior, themes, and language selector. Use semantic accessible markup, safe text APIs for user input, and validate form data.

## Commits and pull requests

Use English [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and keep each commit focused on one logical change.

```text
type(scope): short description
```

For example: `fix(navigation): close the mobile menu`.

Before opening a pull request, review the staged diff and run `git diff --check`. Preview affected pages over HTTP and check relevant screen sizes, themes, languages, keyboard use, and browser errors. For visual changes, include screenshots. Open the PR against the target shown above, describe the change and checks performed, and request a teammate's review. Merge with a merge commit and delete the completed branch after integration.

For release branches, merge the reviewed release into `main` and back into `develop`, then tag the released commit. Merge hotfixes into both `main` and `develop`, and include them in any active release branch.

Update [CHANGELOG.md](CHANGELOG.md) under `Unreleased` when a change is notable. Follow [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) and [GitHub's contributor guidance](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors).
