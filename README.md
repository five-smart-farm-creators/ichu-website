# ICHU — Landing Page

Sitio estático de ICHU, una plataforma peruana de tecnología para la ganadería. Usa HTML semántico, CSS y JavaScript nativos, sin proceso de compilación.

## Estructura

```text
.
├── index.html                 # Portada
├── media.html                 # Web y Media
├── como-funciona.html         # Recorrido paso a paso
├── assets/
│   ├── images/                # Imágenes y recursos de marca
│   ├── scripts/               # Carga de fragmentos, idioma e interacciones
│   ├── styles/                # Estilos del sitio
│   └── videos/                # Videos del producto
├── partials/
│   ├── _header.html           # Navegación y menú móvil compartidos
│   └── _footer.html           # Pie compartido
├── .editorconfig              # Codificación e indentación
├── .gitattributes             # Normalización de texto y archivos binarios
├── .gitignore                 # Archivos excluidos del repositorio
└── README.md
```

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Portada y secciones de ICHU |
| `media.html` | Recorridos de la plataforma e historias de campo |
| `como-funciona.html` | Registro, supervisión y decisión |

Las páginas se mantienen en la raíz de publicación para que el alojamiento estático pueda servir `index.html` directamente. La cabecera y el pie se mantienen en `partials/` y se cargan con `fetch` desde `assets/scripts/partials.js`.

## Desarrollo local

Los fragmentos compartidos requieren que el sitio se sirva por HTTP. Desde la raíz de esta carpeta:

```bash
python -m http.server 8080
```

Abre `http://localhost:8080/`. No se requieren Node.js, paquetes npm ni herramientas de compilación.

## Organización del código

- Mantén el contenido y la estructura en HTML semántico; guarda las reglas visuales en `assets/styles/styles.css`.
- Reutiliza la cabecera y el pie mediante `partials/`. Coloca la lógica de comportamiento en `assets/scripts/`.
- Usa nombres descriptivos, rutas relativas con `/` y minúsculas para los nuevos recursos.
- Guarda los archivos de texto como UTF-8 y con finales de línea LF. `.editorconfig` y `.gitattributes` aplican estas convenciones.
- Ordena el CSS por tokens, estilos base, tipografía, componentes, secciones, variantes de tema, reglas responsive y movimiento reducido.
- Añade comentarios cuando expliquen una decisión o una sección, no para repetir el código.
- No agregues atributos `style` ni bloques `<style>` a las páginas. Para estilos nuevos, crea una clase en CSS.

## Funcionalidades

- Tema claro y oscuro persistido en `localStorage`.
- Idiomas español e inglés mediante el diccionario de `assets/scripts/i18n.js`.
- Menú responsive, submenús accesibles y cierre con Escape.
- Formulario de demostración y chat ilustrativo.
- Animaciones y contadores que respetan `prefers-reduced-motion`.
- Video del collar reproducido únicamente cuando su sección está visible en modo noche.

## Metadatos y datos pendientes

Cada página define título, descripción, URL canónica, datos Open Graph y Twitter específicos. La imagen de vista previa es `assets/images/ichu-social-preview.jpg`.

Antes de producción, confirma el dominio `ichu.pe`, el número de WhatsApp, el correo y las cuentas de redes sociales. Los enlaces de redes y el número de WhatsApp actuales son valores de demostración.

## Publicación

Publica el contenido de esta carpeta como raíz del sitio estático. El directorio publicado debe contener `index.html`, `assets/` y `partials/` al mismo nivel.
