# Portfolio Personal - Juan Tarca

Desarrollo de sitio web para el final libre de Desarrollo Web. El mismo simula mi portfolio personal, junto al apartado "blog" para demostar el manejo de modales, tarjetas con el JS y los comentarios guardados en el local storage. 

Para el manejo de versiones, fui creando distintas ramas o branches y en GitHub Pages solamente se ve lo que tengo en la rama main. Esto me permite evitar que esté en producción un cambio que aún no sé si funciona 100%. Una vez que se hizo el test correspondiente con la rama, se pide una Pull Request; allí (en caso de que tenga un equipo de más de una persona), se puede requerir aprobación para que se mergee (mergee hace referencia a Merge, en inglés, que es cuando una rama se mezcla con la otra) y recién ahí pasan a producción los cambios


## Enlace de GitHub pages
https://juantarca.github.io/examen-dw/

## Despliegue del sitio

### Cómo obtener un dominio (Teoría)
Para obtener un dominio propio (ej: `juantarca.com`):
1.  **Registrar el dominio:** Se compra en un registrador como GoDaddy, Namecheap o NIC Argentina.
2.  **Contratar Hosting:** Se necesita un servidor (Vercel, Netlify, Hostinger) para alojar los archivos.
3.  **Configurar DNS:** Se apuntan los DNS del dominio a la IP o nameservers del hosting elegido.

### Publicación en GitHub Pages
Pasos realizados para este proyecto:
1.  Se creó un repositorio público en GitHub llamado `examen-dw`.
2.  Se subieron los archivos respetando la estructura de carpetas (css, js, img, data).
3.  En GitHub, ir a **Settings > Pages**.
4.  En "Source", se seleccionó la rama `main` y la carpeta `/root`.
5.  GitHub generó la URL pública del proyecto.

## Estructura del proyecto

examen-dw/
├── css/
│   ├── global.css      # Estilos generales, variables, reset y dark mode
│   ├── index.css       # Estilos específicos del Home
│   ├── proyectos.css   # Estilos para la grilla y el aside de filtros
│   ├── blog.css        # Estilos para tarjetas de artículos y modal
│   └── contacto.css    # Estilos para el formulario y validaciones
├── js/
│   └── app.js          # Lógica central del sitio (Menú, JSON, Eventos)
├── img/                # Recursos gráficos optimizados
├── data/
│   └── posts.json      # Base de datos simulada para la carga de proyectos
├── index.html
├── proyectos.html
├── blog.html
├── contacto.html
└── README.md

## Tecnologías Utilizadas

* **HTML5:** Estructura semántica (header, nav, main, aside, article, footer) y accesibilidad (ARIA).
* **CSS3:**
    * Diseño responsivo con **Flexbox** y **CSS Grid**.
    * Variables CSS (`:root`) para gestión de temas (Modo Claro/Oscuro).
    * Animaciones con `@keyframes` y transiciones.
* **JavaScript (ES6+):**
    * Manipulación del DOM y manejo de Eventos.
    * **Fetch API** y `Async/Await` para consumo de datos JSON.
    * **LocalStorage** para persistencia de datos (preferencia de tema y comentarios).
* **Librería Externa:** [Glide.js](https://glidejs.com/) para el carrusel de imágenes.
* **Control de Versiones:** Git y GitHub.


## Justificación de Decisiones Técnicas
Uso de Variables CSS (:root):

Decisión: Centralizar colores, espaciados y tipografías en variables CSS nativas.

Justificación: Facilita enormemente la implementación del Modo Oscuro y el mantenimiento a largo plazo. Al cambiar un valor en :root, se actualiza automáticamente en toda la web, asegurando coherencia visual.

Carga de Proyectos vía fetch() y JSON:

Decisión: Separar los datos (contenido de los proyectos) de la estructura (HTML) mediante un archivo data/posts.json.

Justificación: Simula un entorno profesional real donde los datos provienen de una API externa. Esto permite escalar el portfolio agregando nuevos proyectos al archivo JSON sin necesidad de editar el código HTML ni tocar la estructura del DOM manualmente.

Enfoque Mobile-First:

Decisión: Diseñar los estilos base para pantallas pequeñas y utilizar @media (min-width) para adaptar el diseño a pantallas más grandes.

Justificación: Optimiza el rendimiento en dispositivos móviles (que suelen tener conexiones más inestables) al cargar solo el CSS necesario por defecto. Además, simplifica la escritura de código al evitar la complejidad de sobrescribir estilos de escritorio para "achicarlos" a móvil.

Uso combinado de CSS Grid y Flexbox:

Decisión: Utilizar Grid para los layouts estructurales (Grilla de proyectos, Footer, Layout principal con Aside) y Flexbox para los componentes de una dimensión (Barra de navegación, contenido interno de tarjetas).

Justificación: Aprovecha las fortalezas específicas de cada sistema. CSS Grid es superior para definir estructuras bidimensionales (filas y columnas), mientras que Flexbox es ideal para alinear y distribuir espacio entre elementos en una sola dirección.

Persistencia con LocalStorage:

Decisión: Almacenar la preferencia de tema (Oscuro/Claro) y los comentarios del blog en el almacenamiento local del navegador.

Justificación: Mejora significativamente la Experiencia de Usuario (UX). Si el usuario elige navegar en "Modo Oscuro", el sitio recuerda su elección al recargar o cambiar de página, evitando la frustración de tener que configurarlo nuevamente en cada visita.


