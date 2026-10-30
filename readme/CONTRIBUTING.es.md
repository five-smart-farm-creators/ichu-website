# Contribuir a ICHU Website

[English](../CONTRIBUTING.md) · **Español**

Puedes contribuir con correcciones de errores, mejoras de accesibilidad y ajustes de documentación. Mantén cada contribución enfocada y conversa sobre nuevas funcionalidades o cambios grandes en un [issue](https://github.com/five-smart-farm-creators/ichu-website/issues) antes de comenzar. Consulta el [README](README.es.md#ejecutar-en-local) para visualizar el sitio.

## Ramas

Usamos Gitflow para entregas planificadas. `main` contiene las versiones publicadas y `develop` integra la próxima entrega. Trabaja en ramas temporales e intégralas mediante pull requests (PR).

| Rama | Parte de | Se fusiona en |
| --- | --- | --- |
| `feature/<description>` — nueva funcionalidad | `develop` | `develop` |
| `fix/<description>` — correcciones habituales | `develop` | `develop` |
| `docs/<description>` — documentación | `develop` | `develop` |
| `refactor/<description>` — reorganización interna | `develop` | `develop` |
| `chore/<description>` — mantenimiento | `develop` | `develop` |
| `release/<version>` — preparación de una entrega | `develop` | `main` y `develop` |
| `hotfix/<description>` — corrección urgente en producción | `main` | `main` y `develop` |

Usa nombres cortos en inglés, en minúsculas y separados por guiones, como `fix/mobile-menu`.

## Formato de los commits

Usa [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) en inglés:

```text
type(scope): description
```

Por ejemplo, `fix(navigation): close the mobile menu`. Agrupa los archivos de un cambio lógico en cada commit. Separa los cambios independientes.

## Flujo de trabajo habitual

1. Guarda el trabajo existente, actualiza `develop` y crea una rama:

   ```sh
   git status
   git fetch origin --prune
   git switch develop
   git pull --ff-only origin develop
   git switch -c feature/improve-navigation
   ```

2. Realiza y revisa un cambio lógico, prepara sus archivos y crea el commit:

   ```sh
   git diff
   git add assets/scripts/main.js partials/_header.html
   git diff --cached
   git diff --cached --check
   git commit -m "feat(navigation): add a help link"
   ```

   Adapta las rutas y el mensaje a tu cambio.

3. Con tu trabajo confirmado en commits, incorpora los cambios del equipo, revisa el resultado y publica:

   ```sh
   git fetch origin
   git merge origin/develop
   git push -u origin feature/improve-navigation
   ```

   Ante conflictos, conserva los cambios necesarios de ambos lados, prepara los archivos resueltos y ejecuta `git commit`. Coordina con el autor si tienes dudas. Usa `git merge --abort` para cancelar una fusión en curso. Si un comando falla, resuelve el problema antes de continuar; no fuerces un push sobre el historial compartido.

4. Abre un PR con **base: `develop`** y **compare: tu rama**. Explica el cambio, enlaza el issue si corresponde, indica las verificaciones reales y adjunta capturas si cambiaste el diseño. Solicita la revisión de un compañero, resuelve sus observaciones y usa **Create a merge commit** para conservar los commits individuales.

5. Después de fusionar, elimina la rama terminada en GitHub y limpia tu copia local:

   ```sh
   git switch develop
   git pull --ff-only origin develop
   git branch -d feature/improve-navigation
   git fetch origin --prune
   ```

   Conserva `main`, `develop` y las ramas que sigan en uso.

## Antes de solicitar revisión

- Sigue las reglas de estructura, idioma y comentarios de [AGENTS.md](../AGENTS.md).
- Visualiza las páginas afectadas mediante HTTP. Revisa los enlaces, imágenes, errores del navegador, vistas móviles y de escritorio, ambos temas e idiomas y el uso del teclado que correspondan al cambio.
- Ejecuta `git diff --check` e inspecciona los cambios preparados. Indica en el PR las verificaciones y sus limitaciones; actualmente no hay una suite de pruebas automatizadas configurada.
- Actualiza ambos idiomas cuando cambies estas guías. Da comentarios respetuosos y concretos.

## Entregas y correcciones urgentes

Un responsable crea `release/<version>` desde `develop` actualizado y limita los cambios a estabilizar la versión. Después de validar y revisar, fusiona PR hacia `main` y de vuelta hacia `develop`, etiqueta el commit publicado en `main` y elimina la rama después de ambas integraciones.

Para un error urgente publicado, crea `hotfix/<description>` desde `main` actualizado. Revisa y fusiona el cambio en `main` y `develop`, incorpóralo en cualquier rama de entrega activa y etiqueta la versión corregida. Elimina la rama después de integrarla.

Más información: [Gitflow](https://nvie.com/posts/a-successful-git-branching-model/) y [guía de contribución de GitHub](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors).
