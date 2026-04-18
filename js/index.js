// Archivo JS ligero: validación de formulario y utilidades
document.addEventListener('DOMContentLoaded', function () {
  // Colocar año actual
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Formulario de contacto: envío real gestionado por FormSubmit (sin backend propio)

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  // Navbar sin animación de seguimiento del cursor

  // Menú hamburguesa para móvil
  (function () {
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('siteNav');
    const navBackdrop = document.getElementById('navBackdrop');
    const header = document.querySelector('.site-header');
    if (!navToggle || !mainNav || !header) return;

    function setMenuState(isOpen) {
      const isMobile = window.matchMedia('(max-width: 900px)').matches;
      const shouldOpen = isOpen && isMobile;
      mainNav.classList.toggle('is-open', isOpen);
      if (navBackdrop) {
        navBackdrop.classList.toggle('is-visible', shouldOpen);
      }
      document.body.classList.toggle('body-lock', shouldOpen);
      navToggle.setAttribute('aria-expanded', String(shouldOpen));
      navToggle.setAttribute('aria-label', shouldOpen ? 'Cerrar menú' : 'Abrir menú');
    }

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = mainNav.classList.contains('is-open');
      setMenuState(!open);
    });

    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        setMenuState(false);
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', function () {
        setMenuState(false);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setMenuState(false);
      }
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 900px)').matches) {
          setMenuState(false);
        }
      });
    });

    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width: 900px)').matches) {
        setMenuState(false);
      }
    });
  })();

  // Ventana flotante cerrable con entrada animada en JS
  (function () {
    const popup = document.getElementById('ductosPopup');
    const closeBtn = document.getElementById('ductosPopupClose');
    const footer = document.querySelector('.site-footer');
    if (!popup || !closeBtn) return;

    let dismissed = false;
    let hasAnimated = false;
    const baseBottom = 20;

    function updatePopupPosition() {
      if (!footer || dismissed || popup.classList.contains('is-hidden')) return;

      const footerRect = footer.getBoundingClientRect();
      const overlap = Math.max(0, window.innerHeight - footerRect.top + 12);
      popup.style.bottom = `${baseBottom + overlap}px`;
    }

    function revealPopup() {
      if (dismissed || hasAnimated) return;
      hasAnimated = true;

      popup.animate([
        { opacity: 0, transform: 'translate3d(-120%,0,0)' },
        { opacity: 1, transform: 'translate3d(18px,0,0)', offset: 0.82 },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ], {
        duration: 3200,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'forwards'
      });

      popup.classList.add('show');
      updatePopupPosition();
    }

    setTimeout(revealPopup, 350);

    window.addEventListener('scroll', function () {
      if (!dismissed && window.scrollY > 20) {
        revealPopup();
      }
      updatePopupPosition();
    });

    window.addEventListener('resize', updatePopupPosition);

    closeBtn.addEventListener('click', function () {
      dismissed = true;
      popup.animate([
        { opacity: 1, transform: 'translate3d(0,0,0)' },
        { opacity: 0, transform: 'translate3d(-110%,0,0)' }
      ], {
        duration: 240,
        easing: 'ease-in',
        fill: 'forwards'
      });

      setTimeout(function () {
        popup.classList.remove('show');
        popup.classList.add('is-hidden');
      }, 200);
    });

    updatePopupPosition();
  })();

  // Dropdown 'Servicios' - toggle y cierre al hacer click fuera
  (function () {
    const dropdown = document.querySelector('.nav-item.dropdown');
    if (!dropdown) return;
    const toggle = dropdown.querySelector('.dropdown-toggle');

    function closeDropdown() {
      dropdown.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    function openDropdown() {
      dropdown.classList.add('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }

    // Toggle on click (useful para touch devices)
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dropdown.classList.contains('open')) closeDropdown(); else openDropdown();
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) closeDropdown();
    });

    // Cerrar con ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdown();
    });
  })();

  // Carrusel para Manuales HVAC
  (function () {
    const track = document.querySelector('.manual-carousel .carousel-track');
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = document.querySelector('.manual-carousel .carousel-btn.prev');
    const nextBtn = document.querySelector('.manual-carousel .carousel-btn.next');
    const dotsWrap = document.querySelector('.manual-carousel .carousel-dots');
    const manualText = document.querySelector('.manual-text');
    if (!track || !slides.length || !manualText) return;

    let index = 0;

    // Crear dots
    slides.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Manual ${i+1}`);
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => { goTo(i); });
      if (dotsWrap) dotsWrap.appendChild(btn);
    });

    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

    function updateClasses(activeIndex) {
      slides.forEach((s, i) => {
        s.classList.remove('is-active','is-prev','is-next');
        if (i === activeIndex) s.classList.add('is-active');
        else if (i === activeIndex - 1 || (activeIndex === 0 && i === slides.length - 1)) s.classList.add('is-prev');
        else if (i === activeIndex + 1 || (activeIndex === slides.length -1 && i === 0)) s.classList.add('is-next');
      });
    }

    function updateTextFor(index) {
      const slide = slides[index];
      if (!slide) return;
      const meta = slide.querySelector('.slide-meta');
      if (meta) {
        // Reemplaza el contenido de .manual-text con el HTML de .slide-meta
        manualText.innerHTML = meta.innerHTML + `\n<a class="btn" href="#contact">Ver más</a>`;
      }
    }

    function centerOn(target) {
      const viewport = document.querySelector('.manual-carousel .carousel-viewport');
      if (!target || !viewport) return;
      const viewportWidth = viewport.clientWidth;
      const targetWidth = target.getBoundingClientRect().width;
      const moveX = target.offsetLeft - (viewportWidth - targetWidth) / 2;
      track.style.transform = `translateX(${-moveX}px)`;
    }

    function update() {
      const target = slides[index];
      centerOn(target);
      updateClasses(index);
      if (dots.length) dots.forEach((d,i)=>d.classList.toggle('active', i===index));
      updateTextFor(index);
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

    // autoplay
    let autoplay = setInterval(() => goTo(index + 1), 3800);
    const viewport = document.querySelector('.manual-carousel .carousel-viewport');
    if (viewport) {
      viewport.addEventListener('mouseenter', () => clearInterval(autoplay));
      viewport.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(index + 1), 3800); });
    }

    window.addEventListener('resize', () => { setTimeout(update, 80); });

    // inicializar
    update();
  })();

  // Carrusel para Servicios (sin fin: clones para efecto infinito)
  (function () {
    const root = document.querySelector('.services-carousel');
    if (!root) return;
    const track = root.querySelector('.carousel-track');
    const dotsWrap = root.querySelector('.carousel-dots');
    const prevBtn = root.querySelector('.carousel-btn.prev');
    const nextBtn = root.querySelector('.carousel-btn.next');
    if (!track) return;

    // slides originales (cada .slide contiene una .card)
    const originalSlides = Array.from(track.children);
    if (!originalSlides.length) return;

    // clonar primero y último para lograr loop seamless
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    firstClone.setAttribute('data-clone', 'first');
    lastClone.setAttribute('data-clone', 'last');
    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    // colección completa de slides en el DOM (incluye clones)
    let slides = Array.from(track.children);
    const realCount = originalSlides.length;

    // estado: currentIndex se refiere al índice en 'slides' (incluye clones)
    let currentIndex = 1; // empezamos en la primera slide real (después del lastClone)
    let logicalIndex = 0; // 0..realCount-1
    let slideWidth = 0;

    function calcSizes() {
      slides = Array.from(track.children);
      // posicionar sin animación al recalc usando offsetLeft real
      track.style.transition = 'none';
      const node = slides[currentIndex];
      const moveX = node ? -node.offsetLeft : 0;
      track.style.transform = `translateX(${moveX}px)`;
      // restaurar transición
      setTimeout(() => { track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.2,1)'; }, 20);
    }

    // crear dots para cada slide real
    for (let i = 0; i < realCount; i++) {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Servicio ${i+1}`);
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => { goToLogical(i); });
      dotsWrap.appendChild(btn);
    }
    const dots = Array.from(dotsWrap.children);

    function updateDots() {
      dots.forEach((d, i) => d.classList.toggle('active', i === logicalIndex));
    }

    function goToLogical(i) {
      const targetLogical = (i + realCount) % realCount;
      // si venimos del último y vamos al primero -> animar hacia el clone del primero (último índice)
      if (logicalIndex === realCount - 1 && targetLogical === 0) {
        logicalIndex = 0;
        currentIndex = realCount + 1; // índice del firstClone
        slides = Array.from(track.children);
        const node = slides[currentIndex];
        const moveX = node ? -node.offsetLeft : 0;
        track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.2,1)';
        track.style.transform = `translateX(${moveX}px)`;
        updateDots();
        return;
      }

      // si venimos del primero y vamos al último -> animar hacia el clone del último (índice 0)
      if (logicalIndex === 0 && targetLogical === realCount - 1) {
        logicalIndex = realCount - 1;
        currentIndex = 0; // índice del lastClone
        slides = Array.from(track.children);
        const node = slides[currentIndex];
        const moveX = node ? -node.offsetLeft : 0;
        track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.2,1)';
        track.style.transform = `translateX(${moveX}px)`;
        updateDots();
        return;
      }

      // caso normal: mover al slide real correspondiente
      logicalIndex = targetLogical;
      currentIndex = logicalIndex + 1; // offset por el lastClone
      slides = Array.from(track.children);
      const node = slides[currentIndex];
      const moveX = node ? -node.offsetLeft : 0;
      track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.2,1)';
      track.style.transform = `translateX(${moveX}px)`;
      updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToLogical(logicalIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToLogical(logicalIndex + 1));

    // autoplay
    let autoplay = setInterval(() => goToLogical(logicalIndex + 1), 4200);
    const viewport = root.querySelector('.carousel-viewport');
    if (viewport) {
      viewport.addEventListener('mouseenter', () => clearInterval(autoplay));
      viewport.addEventListener('mouseleave', () => { autoplay = setInterval(() => goToLogical(logicalIndex + 1), 4200); });
    }

    // cuando termina la transición, si estamos en clone, saltar al real correspondiente sin animación
    track.addEventListener('transitionend', () => {
      slides = Array.from(track.children);
      const node = slides[currentIndex];
      if (node && node.dataset && node.dataset.clone === 'first') {
        // estamos en el clone del primero -> saltar al primero real
        track.style.transition = 'none';
        currentIndex = 1;
        slides = Array.from(track.children);
        const node1 = slides[currentIndex];
        const moveX1 = node1 ? -node1.offsetLeft : 0;
        track.style.transform = `translateX(${moveX1}px)`;
        logicalIndex = 0;
        updateDots();
        setTimeout(() => { track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.2,1)'; }, 20);
      } else if (node && node.dataset && node.dataset.clone === 'last') {
        // estamos en el clone del último -> saltar al último real
        track.style.transition = 'none';
        currentIndex = realCount;
        slides = Array.from(track.children);
        const node2 = slides[currentIndex];
        const moveX2 = node2 ? -node2.offsetLeft : 0;
        track.style.transform = `translateX(${moveX2}px)`;
        logicalIndex = realCount - 1;
        updateDots();
        setTimeout(() => { track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.2,1)'; }, 20);
      }
    });

    // resize
    window.addEventListener('resize', () => { setTimeout(calcSizes, 80); });

    // inicializar tamaños y posicion
    calcSizes();
  })();

  // Modal para mostrar card ampliada al pulsar 'Ver más'
  (function () {
    const modalRoot = document.getElementById('cardModal');
    const modalInner = document.getElementById('cardModalInner');
    const modalClose = modalRoot ? modalRoot.querySelector('.card-modal-close') : null;
    const modalBackdrop = modalRoot ? modalRoot.querySelector('.card-modal-backdrop') : null;
    if (!modalRoot || !modalInner) return;

    function openModalWithCard(cardEl) {
      if (!cardEl) return;
      // clonar la card para mostrarla en grande
      const clone = cardEl.cloneNode(true);
      // eliminar o neutralizar enlaces dentro del clone para evitar navegación accidental
      clone.querySelectorAll('a').forEach(a => { a.removeAttribute('href'); a.addEventListener('click', e => e.preventDefault()); });
      // eliminar botón 'Ver más' dentro del clone
      const innerBtn = clone.querySelector('.btn.view-more');
      if (innerBtn) innerBtn.remove();

      // limpiar e insertar
      modalInner.innerHTML = '';
      modalInner.appendChild(clone);

      // mostrar modal
      modalRoot.classList.add('open');
      modalRoot.setAttribute('aria-hidden', 'false');

      // focus en botón de cerrar para accesibilidad
      if (modalClose) modalClose.focus();
    }

    function closeModal() {
      modalRoot.classList.remove('open');
      modalRoot.setAttribute('aria-hidden', 'true');
      // limpiar contenido después de la animación breve
      setTimeout(() => { if (modalInner) modalInner.innerHTML = ''; }, 240);
    }

    // delegación: botones 'Ver más' en cards
    document.querySelectorAll('.btn.view-more').forEach(btn => {
      btn.addEventListener('click', function (e) {
        // evitar comportamiento por defecto (ancla)
        e.preventDefault();
        const card = this.closest('.card');
        if (card) openModalWithCard(card);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // cerrar con ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalRoot.classList.contains('open')) closeModal();
    });
  })();
});
