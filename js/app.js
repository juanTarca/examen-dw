document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. AÑO FOOTER ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    // --- 2. MODO OSCURO ---
    const darkToggle = document.getElementById('darkToggle');
    const prefersDark = localStorage.getItem('darkMode') === 'true';
    
    if (prefersDark) {
      document.body.classList.add('theme-dark');
    }
  
    if (darkToggle) {
      darkToggle.setAttribute('aria-pressed', String(prefersDark));
      darkToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('theme-dark');
        darkToggle.setAttribute('aria-pressed', String(isDark));
        localStorage.setItem('darkMode', String(isDark));
      });
    }
  
    // --- 3. MENÚ MÓVIL ---
    const menuToggle = document.getElementById('menuToggle');
    const primaryNav = document.getElementById('primary-nav');
    
    if (menuToggle && primaryNav) {
      menuToggle.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const isOpen = primaryNav.classList.toggle('show');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });
  
      document.addEventListener('click', (ev) => {
        if (!primaryNav.classList.contains('show')) return;
        if (!primaryNav.contains(ev.target) && ev.target !== menuToggle) {
          primaryNav.classList.remove('show');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  
    // --- 4. CARGA DE PROYECTOS (RECUPERADO) ---
    const proyectosGrid = document.getElementById('proyectosGrid');
    const filterSelect = document.getElementById('filterSelect');
    let allProjects = [];

    async function loadProjects() {
        if (!proyectosGrid) return; // Si no estamos en la página de proyectos, salir.
        
        try {
            // Intentamos cargar el JSON
            const res = await fetch('data/posts.json');
            if (!res.ok) throw new Error('No se pudo cargar data/posts.json');
            
            const items = await res.json();
            allProjects = items;
            renderProjects(items);
        } catch (err) {
            console.error(err);
            // Fallback por si falla la carga del JSON
            proyectosGrid.innerHTML = `
                <div class="error-msg" style="grid-column: 1/-1; text-align: center;">
                    <p>No se pudieron cargar los proyectos automáticos.</p>
                </div>`;
        }
    }

    function renderProjects(items) {
        if (!proyectosGrid) return;
        proyectosGrid.innerHTML = '';
        
        if (!items || items.length === 0) {
            proyectosGrid.innerHTML = '<p class="text-muted">No hay proyectos para mostrar.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'project-card';
            card.innerHTML = `
                <img src="${item.img}" alt="${item.title}" loading="lazy">
                <div class="project-meta">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    ${item.details && item.details.tech ? `<p class="text-muted small" style="margin-top:0.5rem"><strong>Tecnologías:</strong> ${item.details.tech.join(', ')}</p>` : ''}
                </div>
                <div class="project-actions">
                    <a class="btn primary" href="${item.link}" target="_blank" rel="noopener">Ver Proyecto</a>
                </div>
            `;
            proyectosGrid.appendChild(card);
        });
    }

    // Filtro de proyectos
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const val = filterSelect.value;
            if (val === 'todos') {
                renderProjects(allProjects);
            } else {
                const filtered = allProjects.filter(p => {
                    const cat = (p.category || '').toLowerCase();
                    // Buscamos coincidencia en categoría o tecnologías
                    const techMatch = p.details && p.details.tech && p.details.tech.some(t => t.toLowerCase().includes(val));
                    return cat === val || techMatch;
                });
                renderProjects(filtered);
            }
        });
    }

    // Ejecutar carga de proyectos
    loadProjects();


    // --- 5. LÓGICA DEL BLOG (MODAL) ---
    const modal = document.getElementById('blogModal');
    const closeModalBtn = document.getElementById('closeModal');
    const readMoreBtns = document.querySelectorAll('.read-more');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalBody = document.getElementById('modalBody');
    const modalImage = document.getElementById('modalImage');
    const modalImageContainer = document.getElementById('modalImageContainer');
  
    if (modal && readMoreBtns.length > 0) {
        readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const title = btn.getAttribute('data-title');
                const date = btn.getAttribute('data-date');
                const content = btn.getAttribute('data-content');
                const imgSrc = btn.getAttribute('data-img');
    
                if(modalTitle) modalTitle.textContent = title;
                if(modalDate) modalDate.textContent = date;
                if(modalBody) modalBody.innerHTML = content;
    
                if (imgSrc && imgSrc !== "") {
                    if(modalImage) modalImage.src = imgSrc;
                    if(modalImageContainer) modalImageContainer.style.display = 'block';
                } else {
                    if(modalImageContainer) modalImageContainer.style.display = 'none';
                }
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
  
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
    }

    // --- 6. COMENTARIOS BLOG ---
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    if (commentForm && commentsList) {
        loadComments();
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const mensaje = document.getElementById('mensaje').value;
            const date = new Date().toLocaleDateString();
            if(nombre && mensaje) {
                const newComment = { nombre, mensaje, date };
                saveComment(newComment);
                renderComment(newComment);
                commentForm.reset();
            }
        });

        function saveComment(comment) {
            let comments = JSON.parse(localStorage.getItem('blogComments')) || [];
            comments.push(comment);
            localStorage.setItem('blogComments', JSON.stringify(comments));
        }

        function loadComments() {
            let comments = JSON.parse(localStorage.getItem('blogComments')) || [];
            comments.forEach(renderComment);
        }

        function renderComment(comment) {
            const div = document.createElement('div');
            div.className = 'comment';
            div.innerHTML = `<div class="comment-meta"><strong>${comment.nombre}</strong> <span style="font-size:0.8rem; color:var(--muted)">${comment.date}</span></div><div class="comment-body">${comment.mensaje}</div>`;
            commentsList.appendChild(div);
        }
    }
    
    // --- 7. CAROUSEL GLIDE (Inicio) ---
    if (document.querySelector('.glide')) {
        if (typeof Glide !== 'undefined') {
            new Glide('.glide', {
                type: 'carousel',
                perView: 2,
                gap: 24,
                peek: { before: 0, after: 0 },
                breakpoints: { 768: { perView: 1 } }
            }).mount();
        }
    }
});