# examen-dw

Este repositorio contiene un sitio estático construido en HTML5, CSS3 y JavaScript para cumplir los requerimientos del trabajo práctico: estructura semántica, estilos mobile-first, interactividad con fetch/localStorage, accesibilidad y despliegue.

## Despliegue y publicación (Guía rápida)

1. Obtener un dominio (teórico)
	- Comprar un dominio en un proveedor (ej. Namecheap, GoDaddy). Luego configurar los registros DNS (A o CNAME) para apuntar a GitHub Pages o proveedor elegido.
	- Para un sitio estático en GitHub Pages se puede usar un `CNAME` con el dominio personalizado en el repositorio.
    - Para dominios ejemplo.ar se ingresa a nic.ar y se hace el tramite de registro de dominio. Alli te pasan los datos para pegar en tu entorno desplegado (puede ser Vercel) y al cabo de unos minutos ves tu sitio web desplegado alli

2. Publicar en GitHub Pages
	- Subir el repositorio a GitHub (crear repo y push).
	- En la configuración del repositorio (Settings > Pages) elegir la rama `main` o `gh-pages` y la carpeta `/ (root)` o `/docs` según la estructura.
	- Si usas `index.html` en la raíz, selecciona la rama y carpeta raíz. GitHub tardará unos segundos en publicar.
	- Si usas un dominio personalizado, agrega un archivo `CNAME` con el dominio en la raíz del repo y configura el DNS del dominio para apuntar a GitHub Pages.


