# Repository Guidelines

These instructions apply throughout the ICHU website. Read [README.md](README.md) for setup and [CONTRIBUTING.md](CONTRIBUTING.md) for the team's Gitflow workflow.

Before editing, read any additional `AGENTS.md` files in the directories leading to the affected file. Apply their rules within that scope.

## Project rules

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
├── locales/
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE.md
└── AGENTS.md
```

- Keep this a static HTML, CSS, and vanilla JavaScript website. Introduce frameworks, dependencies, or build tooling only when the task calls for them.
- Do not create new directories unless the user explicitly asks for them. Fit new files into the documented structure and reuse existing directories.
- Keep page HTML at the root, scripts in `assets/scripts/`, styles in `assets/styles/`, and media in `assets/images/` or `assets/videos/`.
- Reuse `partials/_header.html` and `partials/_footer.html` on regular pages. Preserve the independent recovery navigation on `404.html`.
- Keep translations in `locales/en.json` and `locales/es.json`. Keep `README.md` and `CONTRIBUTING.md` in English only.
- Serve the repository root through HTTP for preview. No package installation or build command is currently required.

## Language and code style

- Use English for identifiers, filenames, source UI text, comments, commits, and documentation. Spanish locale values are the exception.
- Keep English as the default UI language and preserve Spanish support. Use nested semantic camelCase keys and keep both locale trees and placeholders in parity. Format dates and numbers with `Intl` rather than storing formatted values.
- Match surrounding formatting and use two spaces for indentation and UTF-8. Use descriptive camelCase JavaScript names and kebab-case CSS classes and new asset filenames.
- Keep behavior in JavaScript and styling in CSS. Prefer small functions with a clear purpose and reuse existing utilities and design tokens.
- Write short, direct sentences. Use the existing term for each concept. Keep detailed change history in commits and PRs.

## Comments

- Write concise English comments explaining a decision or constraint. Avoid obvious narration, decorative separators, commented out code, and unnecessary comments.
- Use `//` for a single line JavaScript comment. Use a `/* ... */` block spanning multiple lines for a longer explanation. Keep the comment body plain text; required syntax delimiters are allowed.
- In HTML, use `<!-- ... -->` only for useful structural or implementation context. Do not nest comments or put them inside tags. Never include secrets in comments.
- Do not add CSS comments. Use clear selectors and property grouping instead.

## Interface and safety

- Preserve the existing forest green, cream, and mustard design, responsive layout, themes, and language preferences.
- Reuse existing design tokens and visual patterns for colors, typography, buttons, tables, forms, spacing, borders, and interaction states. Build new components from the existing system; do not introduce new palettes, fonts, or styles when an established pattern fits.
- Use semantic headings, associated form labels, descriptive image alternatives, visible keyboard focus, and reduced motion support.
- Render user input with `textContent` or equivalent safe text APIs. Validate inputs and handle failed resource loads without inventing successful outcomes.
- Keep secrets out of browser code. Preserve asset references and check file size when adding media.

## Git workflow

- Check the current branch and working tree before editing. Preserve unrelated work and follow any branch specified by the user.
- Keep `main` for published releases and `develop` for integration. Avoid direct development on either branch.
- Name temporary branches in English using `<type>/<short-kebab-case-description>`, such as `fix/mobile-menu`.

| Branch prefix | Start from | PR target |
| --- | --- | --- |
| `feature/`, `fix/`, `docs/`, `refactor/`, `chore/` | Updated `develop` | `develop` |
| `release/<version>` | Updated `develop` | `main` and `develop` |
| `hotfix/` | Updated `main` | `main` and `develop` |

- Before starting a task branch, fetch remote changes and update its base with `git pull --ff-only`. Resolve any divergence before continuing.
- Before publishing, fetch again and merge the current remote base into the task branch. Resolve conflicts without discarding teammates' work and check the result.
- Target the correct base in each PR, describe the change and actual checks, and obtain a teammate's review. Use **Create a merge commit** to preserve individual commits.
- For releases and hotfixes, tag the released commit on `main`. Include hotfixes in any active release branch. Delete temporary branches only after all required integrations; keep permanent and active shared branches.
- Create commits, push, open or merge PRs, and delete branches only when requested. Check remote changes before publishing and do not force push shared branches.

## Conventional Commits

Use a short English imperative description with this format:

```text
type(scope): description
```

- Use `feat`, `fix`, `docs`, `refactor`, `style`, `test`, or `chore` as appropriate. Choose a meaningful scope such as `navigation`, `i18n`, or `styles`.
- Examples: `fix(navigation): close the mobile menu` and `docs(readme): clarify local setup`.
- Commit one logical change at a time. Include all related files together and separate unrelated changes; do not create a commit per file.
- Review `git diff --cached` and run `git diff --cached --check` before each commit. Exclude secrets, generated local output, and unrelated edits.
- For an incompatible change, use `!` after the type or scope and explain the impact in the commit body.

## Verification and handoff

- Review the diff and run `git diff --check`. For documentation changes, check relative links, images, and commands.
- For code changes, preview affected pages over HTTP and check relevant browser errors, links, mobile layouts, themes, languages, and keyboard interactions. Use focused checks appropriate to the change.
- No automated test suite, linter, or build is currently configured. Do not invent commands or claim checks that did not run.
- Report the result, checks performed, remaining limitations, and commit or push status briefly.
