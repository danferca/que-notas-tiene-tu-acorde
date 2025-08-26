> Herramienta web interactiva para identificar las **notas musicales** que componen cualquier **acorde**.  
> Ideal para estudiantes, músicos y productores que desean comprender qué hay detrás de cada símbolo armónico.

Este es un proyecto web que permite generar acordes musicales mostrando sus notas en **notación latina** (do, re, mi...) a partir de una combinación de tono, alteración y tipo de acorde.

## ✨ ¿Qué hace esta herramienta?

- Selecciona un acorde (ej. **D♭m7**, **Fmaj9**, **G7sus4**).
- Descubre al instante **qué notas lo forman**.
- Escúchalo en tiempo real con un sonido suave tipo arpegio.
- Interfaz visual clara e interactiva.
- Incluye sección de teoría y explicación del propósito del sitio.

## ✨ Características

- Notación latina (do, do♯, re, etc.)
- Soporte para alteraciones y múltiples tipos de acordes
- Reproducción arpegiada con sonido tipo guitarra
- Interfaz responsive y amigable
- Navegación mejorada con menú hamburguesa en móviles
- Optimizado para despliegue como sitio web estático

## 🚀 Demo en línea

👉 https://danferca.github.io/que-notas-tiene-tu-acorde/

## 🗂️ Estructura del Proyecto

que-notas-tiene-tu-acorde/
├── src/ # Archivos fuente (editable)
│ ├── index.html
│ ├── nombre-acorde.html
│ ├── sobre.html
│ ├── privacidad.html
│ ├── terminos.html
│ ├── css/
│ │ ├── base.css
│ │ ├── style-limpio.css
│ │ └── style-nombre-acorde-limpio.css
│ └── js/
│ ├── config.js
│ ├── logic.js
│ ├── sound.js
│ ├── ui.js
│ ├── main.js
│ ├── init-nombre-acorde.js
│ ├── interacciones-globales.js
│ ├── menu.js
│ └── nombre-acorde.js
├── dist/ # Archivos listos para producción
├── build-to-dist.js # Script de build/minificación
├── NOTAS-nueva-funcionalidad.md
├── LICENSE
└── README.md


## 🧩 Tecnologías

- HTML5 + CSS3 + JavaScript (ES Modules)
- Web Audio API para la reproducción
- Diseño responsivo

## 📦 Producción

Generar una versión ligera del proyecto:

```bash
node build-to-dist.js
Esto copiará/minificará los archivos en dist/, listos para despliegue.

🙌 Agradecimientos

Este generador de acordes fue desarrollado con fines educativos y de experimentación en el diseño de herramientas musicales interactivas para la web.

⚠️ Licencia

El contenido de este repositorio está protegido por derechos de autor.
Disponible para uso personal o educativo únicamente en su versión desplegada.
No se permite copia, modificación ni redistribución del código fuente sin autorización expresa del autor.

📬 Contacto: Daniel Cadena
🎵 Inspirado por la pasión por la música y la enseñanza.