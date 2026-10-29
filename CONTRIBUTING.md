# Guía de colaboración

## Ramas del proyecto

- `main`: versión estable aprobada para publicación. No se trabaja directamente en esta rama.
- `develop`: integración general del proyecto.
- `feature/version-1`: trabajo de la primera versión del sitio.
- `fix/version-1`: integración de correcciones y auditorías de la versión 1.

Las correcciones revisadas en `fix/version-1` se integran primero en `feature/version-1`. No las fusionen directamente en `main`.

## Preparar el repositorio

La primera vez, clonen el proyecto y creen su copia local de la rama de correcciones:

```bash
git clone https://github.com/five-smart-farm-creators/ichu-website.git
cd ichu-website
git fetch origin
git switch --track origin/fix/version-1
```

Antes de retomar el trabajo, actualicen la rama compartida:

```bash
git switch fix/version-1
git pull --ff-only origin fix/version-1
```

## Hacer cambios y commits

Para evitar pisar el trabajo de otra persona, creen una rama corta desde `fix/version-1` por cada corrección:

```bash
git switch -c fix/corrige-menu-movil
```

Hagan cambios relacionados con una sola tarea. Revisen qué van a incluir antes de confirmar:

```bash
git status
git add ruta/del/archivo
git diff --cached
git diff --cached --check
git commit -m "fix: corrige el menú en pantallas pequeñas"
git push -u origin fix/corrige-menu-movil
```

Usen mensajes breves que expliquen el cambio. Ejemplos:

- `feat: agrega validación al formulario`
- `fix: corrige los enlaces del pie de página`
- `docs: actualiza las instrucciones de uso`

No incluyan archivos ajenos a la tarea ni suban claves, contraseñas o datos personales.

## Revisar e integrar

1. En GitHub, abran un Pull Request desde su rama `fix/...` hacia `fix/version-1`.
2. Describan qué requisito del profesor atiende y qué archivos cambiaron.
3. Revisen la página relacionada en escritorio y móvil, y comprueben los enlaces y la interacción afectada.
4. Cuando las correcciones estén revisadas, abran otro Pull Request desde `fix/version-1` hacia `feature/version-1`.
5. Mantengan `main` y `develop` sin cambios directos. La integración a esas ramas se hará cuando se apruebe la versión.
