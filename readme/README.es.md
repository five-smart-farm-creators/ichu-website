# ICHU Website

[English](../README.md) · **Español**

[Contribuir](CONTRIBUTING.es.md) · [Guía para agentes](../AGENTS.md)

Sitio web público de ICHU, una plataforma peruana de tecnología ganadera. Presenta el producto a ganaderos y veterinarios y permite preparar una solicitud de demostración por WhatsApp.

![Página de inicio del sitio web de ICHU](website-preview.png)

## Funcionalidades

- Información del producto, tecnología y contenido multimedia.
- Inglés y español, con preferencia de idioma guardada.
- Diseño adaptable, temas claro y oscuro y una página 404 personalizada.
- Formulario de contacto por WhatsApp y un chat ilustrativo.

## Ejecutar en local

```sh
git clone https://github.com/five-smart-farm-creators/ichu-website.git
cd ichu-website
```

Abre la carpeta en VS Code, instala [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) y selecciona **Open with Live Server** sobre `index.html`. También sirve cualquier servidor HTTP de archivos estáticos. HTTP permite cargar los fragmentos compartidos y las traducciones.

Desarrollado con HTML, CSS y JavaScript sin frameworks. No requiere instalar paquetes ni ejecutar una compilación.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `*.html` | Páginas de inicio, funcionamiento, contenido multimedia y 404 |
| `assets/` | Estilos, scripts, imágenes y videos |
| `partials/` | Cabecera y pie de página compartidos |
| `locales/` | Traducciones en inglés y español |
| `readme/` | Documentación en español e imagen de vista previa |

## Publicación

Publica la raíz del repositorio en un alojamiento estático conservando sus carpetas. Configura el alojamiento para servir `404.html` con estado HTTP `404` cuando una página no exista. La página de recuperación está preparada para alojarse en la raíz del dominio.

El formulario prepara un mensaje de WhatsApp; no almacena solicitudes. Configura el número de contacto del equipo antes de publicar.

## Contribuir

Consulta [CONTRIBUTING.es.md](CONTRIBUTING.es.md) para seguir Gitflow y los pasos de contribución. Reporta problemas o conversa sobre cambios grandes en [Issues](https://github.com/five-smart-farm-creators/ichu-website/issues).

Mantenido por [Five Smart Farm Creators](https://github.com/five-smart-farm-creators). Aún no se ha especificado una licencia para el proyecto.
