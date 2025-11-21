document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const darkToggle = document.getElementById('darkToggle');
  const prefersDark = localStorage.getItem('darkMode') === 'true';
  if (prefersDark) document.documentElement.classList.add('dark');
  if (darkToggle) {
    darkToggle.setAttribute('aria-pressed', String(prefersDark));
    darkToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      darkToggle.setAttribute('aria-pressed', String(isDark));
      localStorage.setItem('darkMode', String(isDark));
    });
  }

  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  });

  // Mobile menu (hamburger)
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primary-nav');
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const isOpen = primaryNav.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on Escape
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && primaryNav.classList.contains('show')) {
        primaryNav.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (ev) => {
      if (!primaryNav.classList.contains('show')) return;
      const target = ev.target;
      if (!primaryNav.contains(target) && target !== menuToggle) {
        primaryNav.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('form-feedback');
  const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    motivo: document.getElementById('motivo'),
    detalle: document.getElementById('detalle')
  };

  function showError(field, message) {
    const el = document.getElementById('error-' + field);
    if (el) el.textContent = message || '';
  }

  function validateAll() {
    let ok = true;
    if (!inputs.name.value || inputs.name.value.trim().length < 2) { showError('name','Ingrese al menos 2 caracteres'); ok = false; }
    else showError('name','');
    if (!inputs.email.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inputs.email.value)) { showError('email','Email inválido'); ok = false; }
    else showError('email','');
    if (!inputs.motivo.value) { showError('motivo','Seleccioná una opción'); ok = false; }
    else showError('motivo','');
    if (!inputs.detalle.value || inputs.detalle.value.trim().length < 10) { showError('detalle','Ingrese al menos 10 caracteres'); ok = false; }
    else showError('detalle','');
    return ok;
  }

  Object.values(inputs).forEach(i => {
    if (!i) return;
    i.addEventListener('keyup', () => { validateAll(); saveFormData(); });
    i.addEventListener('change', () => { validateAll(); saveFormData(); });
  });

  function saveFormData() {
    const data = {
      name: inputs.name?.value || '',
      email: inputs.email?.value || '',
      motivo: inputs.motivo?.value || '',
      detalle: inputs.detalle?.value || ''
    };
    localStorage.setItem('contactFormData', JSON.stringify(data));
  }

  function restoreFormData() {
    const raw = localStorage.getItem('contactFormData');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.name) inputs.name.value = data.name;
      if (data.email) inputs.email.value = data.email;
      if (data.motivo) inputs.motivo.value = data.motivo;
      if (data.detalle) inputs.detalle.value = data.detalle;
    } catch(e) {  }
  }
  restoreFormData();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = validateAll();
      if (!ok) {
        feedback.hidden = false;
        feedback.textContent = 'Hay errores en el formulario. Corrijalos antes de enviar.';
        return;
      }

      feedback.hidden = false;
      feedback.textContent = 'Enviando mensaje...';

      setTimeout(() => {
        feedback.textContent = 'Mensaje enviado correctamente. Gracias! (simulado)';
        if (window.MicroModal) {
          if (!document.getElementById('modal-1')) {
            const modal = document.createElement('div');
            modal.id = 'modal-1';
            modal.className = 'modal micromodal-slide';
            modal.innerHTML = `
              <div class="modal__overlay" tabindex="-1" data-micromodal-close>
                <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
                  <header class="modal__header">
                    <h2 id="modal-1-title">Gracias</h2>
                    <button class="modal__close" aria-label="Cerrar" data-micromodal-close></button>
                  </header>
                  <main class="modal__content" id="modal-1-content">Mensaje enviado correctamente.</main>
                  <footer class="modal__footer">
                    <button class="modal__btn" data-micromodal-close aria-label="Cerrar">Cerrar</button>
                  </footer>
                </div>
              </div>`;
            document.body.appendChild(modal);
          }
          MicroModal.init();
          MicroModal.show('modal-1');
        }

        localStorage.removeItem('contactFormData');
        form.reset();
      }, 700);
    });

    form.addEventListener('reset', () => {
      localStorage.removeItem('contactFormData');
      setTimeout(() => { 
        ['name','email','motivo','detalle'].forEach(k => showError(k,''));
        feedback.hidden = true;
      }, 50);
    });
  }

  // Render projects only on the Proyectos page (container #proyectosGrid)
  const proyectosGrid = document.getElementById('proyectosGrid');
  const filterSelect = document.getElementById('filterSelect');
  let allProjects = [];

  async function loadProjects() {
    if (!proyectosGrid) return; // do nothing if not on proyectos page
    // ensure the grid has the responsive grid class (in case HTML didn't include it)
    proyectosGrid.classList.add('grid-cols-2');
    try {
      const res = await fetch('data/posts.json');
      if (!res.ok) throw new Error('Error al cargar datos');
      const items = await res.json();
      allProjects = items;
      renderProjects(items);
    } catch (err) {
      proyectosGrid.innerHTML = `<p class="text-muted">No se pudieron cargar los proyectos.</p>`;
      console.error(err);
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
      card.setAttribute('tabindex','0');
      card.dataset.projectId = item.id;
      card.innerHTML = `
        <a class="project-link" href="${item.link}" target="_blank" rel="noopener">
          <img src="${item.img}" alt="${item.title}">
        </a>
        <div class="project-meta">
          <h3>${item.title}</h3>
          <p class="text-muted">${item.description}</p>
          ${item.details ? `<p class="text-muted small">Tecnologías: ${ (item.details.tech||[]).join(', ') }</p>` : ''}
        </div>
        <div class="project-actions">
          <a class="btn" href="${item.link}" target="_blank" rel="noopener">Ver</a>
        </div>
        <div class="project-comments" aria-live="polite">
          <div class="comments-list" data-comments-for="${item.id}"></div>
          <form class="comment-form" data-form-for="${item.id}" aria-label="Agregar comentario">
            <input name="commenter" type="text" placeholder="Tu nombre" required class="commenter-input">
            <textarea name="comment" placeholder="Escribí un comentario..." required class="comment-input"></textarea>
            <div class="comment-actions">
              <button type="submit" class="btn primary">Comentar</button>
            </div>
            <div class="comment-feedback" aria-live="polite"></div>
          </form>
        </div>`;

      // keyboard: Enter on card opens link
      card.addEventListener('keyup', (ev) => { if (ev.key === 'Enter') card.querySelector('.project-link')?.click(); });

      proyectosGrid.appendChild(card);

      // after append, wire up comments area
      const commentsList = card.querySelector('.comments-list');
      const commentForm = card.querySelector('.comment-form');
      const feedbackEl = card.querySelector('.comment-feedback');
      const projectId = String(item.id);

      function renderCommentsForProject() {
        const comments = getComments(projectId);
        commentsList.innerHTML = '';
        if (!comments || comments.length === 0) {
          commentsList.innerHTML = '<p class="text-muted">Sé el primero en comentar.</p>';
          return;
        }
        comments.forEach(c => {
          const el = document.createElement('div');
          el.className = 'comment';
          el.innerHTML = `<div class="comment-meta"><strong>${escapeHtml(c.name)}</strong> · <span class="small text-muted">${new Date(c.date).toLocaleString()}</span></div><div class="comment-body">${escapeHtml(c.text)}</div>`;
          commentsList.appendChild(el);
        });
      }

      // handle form submit
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = commentForm.querySelector('.commenter-input').value.trim();
        const text = commentForm.querySelector('.comment-input').value.trim();
        if (!name || !text) {
          feedbackEl.textContent = 'Nombre y comentario son obligatorios.';
          return;
        }
        const newComment = { name, text, date: new Date().toISOString() };
        const comments = getComments(projectId);
        comments.push(newComment);
        saveComments(projectId, comments);
        commentForm.reset();
        feedbackEl.textContent = 'Comentario guardado (localmente).';
        setTimeout(() => feedbackEl.textContent = '', 2000);
        renderCommentsForProject();
      });

      // initial render
      renderCommentsForProject();
    });
  }

  // Filter handling (if filterSelect exists)
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      const val = filterSelect.value;
      if (val === 'todos') renderProjects(allProjects);
      else {
        const filtered = allProjects.filter(p => {
          // try to match by category or tech fields if present
          const cat = (p.category || '').toString().toLowerCase();
          const techs = (p.details && p.details.tech) ? p.details.tech.join(' ').toLowerCase() : '';
          return cat === val || techs.includes(val);
        });
        renderProjects(filtered);
      }
    });
  }

  loadProjects();

  // COMMENTS: localStorage helpers and HTML-escape helper
  function commentsKey(projectId) { return `projectComments_${projectId}`; }
  function getComments(projectId) {
    try {
      const raw = localStorage.getItem(commentsKey(projectId));
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveComments(projectId, comments) {
    try { localStorage.setItem(commentsKey(projectId), JSON.stringify(comments)); } catch(e) { console.error(e); }
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
});
