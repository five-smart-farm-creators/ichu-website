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
│   │   └── style.css
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

| Branch | Branch from | Merge into |
| --- | --- | --- |
| `feature/<short-description>` | `develop` | `develop` (pull request) |
| `bugfix/<short-description>` | `develop` | `develop` (pull request) |
| `release/vX.Y.Z` | `develop` | `main` and back into `develop`; tag `vX.Y.Z` on `main` |
| `hotfix/vX.Y.Z` | `main` | `main` and back into `develop`; tag `vX.Y.Z` on `main` |

Never open a pull request from `develop` to `main`; releases always go through `release/vX.Y.Z`. Do not use other branch prefixes such as `fix/`, `docs/`, `refactor/`, `chore/`, or `audit/`.

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
- Keep all CSS in `assets/styles/style.css`. Reuse the shared header and footer from `partials/` on every page, including the 404 page.
- Use descriptive camelCase names for local JavaScript variables, configuration values, parameters, and functions. Keep each feature in a focused initializer and preserve established public script contracts.
- Avoid duplicate logic, markup, or styles; unused code; unnecessary dependencies; and layers of CSS overrides.
- Keep functions focused and CSS rules organized. Optimize when there is a clear need, while keeping the solution straightforward to maintain.
- Keep translations in `locales/en.json` and `locales/es.json` with nested semantic camelCase keys and matching key trees and placeholders. Preserve English as the default, Spanish support, and the saved language preference; format dates and numbers with `Intl`.
- Write source code and comments in English; Spanish text belongs in `locales/es.json`. Use `//` for single line JavaScript comments and `/* ... */` for comments spanning multiple lines. Explain nonobvious decisions, add HTML comments only when useful, and do not add CSS comments.
- Preserve the existing visual system, responsive behavior, themes, and language selector. Use semantic accessible markup, safe text APIs for user input, and validate form data.

## Commits and pull requests

Use English [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and keep each commit focused on one logical change.

```text
type(scope): short description
```

For example: `fix(layout): close the mobile menu`.

Commit messages must also follow these rules:

- Use one of these types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`.
- Use `feat` only for new functionality. Use `docs` for documentation and diagram changes, and `chore` for changelog, version, or maintenance changes.
- Write the summary in English, in the imperative mood, starting with a lowercase letter, without a trailing period. The header must not exceed 72 characters.
- Use a scope in lowercase kebab-case that names the affected area. Allowed scopes: `home`, `how-it-works`, `media`, `layout`, `i18n`, `seo`, `assets`.
- Do not use the default message of the GitHub web editor, such as `Update file.md`.

Invalid examples:

```text
(Docs): Add user personas
Update chapter02.md
feat: add controllers.
faet: add planning service
```

Before opening a pull request, review the staged diff and run `git diff --check`. Preview affected pages over HTTP and check relevant screen sizes, themes, languages, keyboard use, and browser errors. For visual changes, include screenshots. Open the PR against the target shown above, describe the change and checks performed, and request a teammate's review. Merge with a merge commit and delete the completed branch after integration.

For release branches, merge the reviewed release into `main` and back into `develop`, then tag the released commit. Merge hotfixes into both `main` and `develop`, and include them in any active release branch.

Update [CHANGELOG.md](CHANGELOG.md) under `Unreleased` when a change is notable. Follow [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) and [GitHub's contributor guidance](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors).

## Enforcement

- After cloning, run once: `git config core.hooksPath .githooks`. The `commit-msg` hook rejects invalid messages locally.
- The `Git Flow checks` GitHub Actions workflow validates the branch name, the pull request target, and every commit message on pull requests to `main` and `develop`.
- Configure Git with your real name and the email linked to your GitHub account (`git config user.name` and `git config user.email`). `.mailmap` maps previously used alternative identities.
