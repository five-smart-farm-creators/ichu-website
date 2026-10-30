# Contributing to ICHU Website

**English** · [Español](readme/CONTRIBUTING.es.md)

We welcome bug fixes, accessibility improvements, and documentation corrections. Keep contributions focused and discuss new features or large changes in an [issue](https://github.com/five-smart-farm-creators/ichu-website/issues) first. Follow the [README](README.md#run-locally) for local preview.

## Branches

We use Gitflow for planned releases. `main` holds published releases; `develop` integrates the next release. Work on temporary branches and integrate through pull requests (PRs).

| Branch | Start from | Merge into |
| --- | --- | --- |
| `feature/<description>` — new functionality | `develop` | `develop` |
| `fix/<description>` — routine fixes | `develop` | `develop` |
| `docs/<description>` — documentation | `develop` | `develop` |
| `refactor/<description>` — internal restructuring | `develop` | `develop` |
| `chore/<description>` — maintenance | `develop` | `develop` |
| `release/<version>` — release preparation | `develop` | `main` and `develop` |
| `hotfix/<description>` — urgent production fix | `main` | `main` and `develop` |

Use short English names in lowercase with hyphens, such as `fix/mobile-menu`.

## Commit format

Use English [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
type(scope): description
```

For example, `fix(navigation): close the mobile menu`. Group files for one logical change in each commit. Separate unrelated changes.

## Everyday workflow

1. Save existing work, update `develop`, and create a branch:

   ```sh
   git status
   git fetch origin --prune
   git switch develop
   git pull --ff-only origin develop
   git switch -c feature/improve-navigation
   ```

2. Make and check a logical change, then stage its files and commit:

   ```sh
   git diff
   git add assets/scripts/main.js partials/_header.html
   git diff --cached
   git diff --cached --check
   git commit -m "feat(navigation): add a help link"
   ```

   Adapt the paths and message to your change.

3. With your work committed, incorporate teammates' changes, check the result, and publish:

   ```sh
   git fetch origin
   git merge origin/develop
   git push -u origin feature/improve-navigation
   ```

   For conflicts, preserve the intended changes from both sides, stage the resolved files, and run `git commit`. Coordinate with the author when unsure. Use `git merge --abort` to cancel an unfinished merge. If any command fails, resolve the problem before continuing; do not force push shared history.

4. Open a PR with **base: `develop`** and **compare: your branch**. Explain the change, link the issue if applicable, list actual checks, and attach screenshots for visual changes. Get a teammate's review, resolve feedback, and use **Create a merge commit** to preserve individual commits.

5. After merging, delete the completed branch on GitHub, then clean up locally:

   ```sh
   git switch develop
   git pull --ff-only origin develop
   git branch -d feature/improve-navigation
   git fetch origin --prune
   ```

   Keep `main`, `develop`, and branches still in use.

## Before requesting review

- Match the existing project structure, code style, and comment conventions.
- Preview affected pages through HTTP. Check relevant links, images, browser errors, mobile and desktop layouts, both themes and languages, and keyboard navigation.
- Run `git diff --check` and inspect the staged diff. Document checks and limitations in the PR; no automated test suite is currently configured.
- Update both documentation languages when changing these guides. Give respectful, specific feedback.

## Releases and hotfixes

A maintainer creates `release/<version>` from updated `develop` and limits changes to stabilization. After validation and review, merge PRs into `main` and back into `develop`, tag the released commit on `main`, and delete the release branch after both integrations.

For an urgent published defect, create `hotfix/<description>` from updated `main`. Review and merge it into both `main` and `develop`, include it in any active release branch, and tag the corrected release. Delete the branch after integration.

Further reading: [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) and [GitHub contribution guidance](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors).
