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

  const projectsList = document.getElementById('projects-list');
  async function loadProjects() {
    try {
      const res = await fetch('data/posts.json');
      if (!res.ok) throw new Error('Error al cargar datos');
      const items = await res.json();
      renderProjects(items);
    } catch (err) {
      if (projectsList) projectsList.innerHTML = `<p class="muted">No se pudieron cargar los proyectos.</p>`;
      console.error(err);
    }
  }

  function renderProjects(items) {
    if (!projectsList) return;
    projectsList.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('tabindex','0');
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="project-meta">
          <h3>${item.title}</h3>
          <p class="muted">${item.description}</p>
        </div>
        <div class="project-actions">
          <a class="btn" href="${item.link}" target="_blank" rel="noopener">Ver</a>
          <button class="project-remove">Eliminar</button>
        </div>`;
      const removeBtn = card.querySelector('.project-remove');
      removeBtn.addEventListener('click', () => {
        card.remove();
      });
      card.addEventListener('keyup', (ev) => { if (ev.key === 'Enter') card.querySelector('a')?.click(); });
      projectsList.appendChild(card);
    });
  }

  loadProjects();
});
