# ICHU — Landing Page

Sitio estático de ICHU, una plataforma peruana de tecnología para la ganadería. Usa HTML semántico, CSS y JavaScript nativos, sin proceso de compilación.

## Estructura

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

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Portada y secciones de ICHU |
| `media.html` | Recorridos de la plataforma e historias de campo |
| `como-funciona.html` | Registro, supervisión y decisión |

Las páginas se mantienen en la raíz de publicación para que el alojamiento estático pueda servir `index.html` directamente. La cabecera y el pie se mantienen en `partials/` y se cargan con `fetch` desde `assets/scripts/partials.js`.

## Funcionalidades

- Tema claro y oscuro persistido en `localStorage`.
- Idiomas español e inglés mediante el diccionario de `assets/scripts/i18n.js`.
- Menú responsive, submenús accesibles y cierre con Escape.
- Formulario de demostración y chat ilustrativo.
- Animaciones y contadores que respetan `prefers-reduced-motion`.
- Video del collar reproducido únicamente cuando su sección está visible en modo noche.

## Publicación

Publica el contenido de esta carpeta como raíz del sitio estático. El directorio publicado debe contener `index.html`, `assets/` y `partials/` al mismo nivel.
