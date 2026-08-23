/* ==========================================================================
   ROBO LED PARTNER — SCRIPT PRINCIPAL
   Navegação responsiva, filtros de catálogo, lightbox e scroll observer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. Menu Mobile Drawer
    // ----------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const drawerClose = document.getElementById('drawer-close');
    const navDrawer = document.getElementById('nav-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.nav-drawer__link');

    function openDrawer() {
        if (!navDrawer || !drawerOverlay) return;
        navDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        navDrawer.setAttribute('aria-hidden', 'false');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (!navDrawer || !drawerOverlay) return;
        navDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        navDrawer.setAttribute('aria-hidden', 'true');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Fechar com tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDrawer && navDrawer.classList.contains('active')) {
            closeDrawer();
        }
    });

    // ----------------------------------------------------------------------
    // 2. Header Scroll Effect & Active Link Observer
    // ----------------------------------------------------------------------
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id], footer[id]');

    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver para destacar link ativo do menu
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === '#' + id) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // ----------------------------------------------------------------------
    // 3. Filtro de Categorias dos Personagens
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.char-filter');
    const characterCards = document.querySelectorAll('.char-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Atualizar botões ativos
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filterValue = button.getAttribute('data-filter');

            // Filtrar cards
            characterCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 4. Lightbox Modal para Galeria Real
    // ----------------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxOverlay = document.getElementById('lightbox-overlay');

    function openLightbox(src, caption) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = caption || 'Foto do evento Robo LED Partner';
        if (lightboxCaption) lightboxCaption.textContent = caption || '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        if (lightboxImg) lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src') || (item.querySelector('img') ? item.querySelector('img').src : '');
            const caption = item.getAttribute('data-caption') || '';
            openLightbox(src, caption);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

});
