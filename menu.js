/* ==========================================================================
   ROBO LED PARTNER — SCRIPT PRINCIPAL INTERATIVO (V4.0)
   3D Globe Controller, Side Navigation, Dynamic Progress Bar & Filter
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. Mobile Drawer Navigation
    // ----------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const drawerClose = document.getElementById('drawer-close');
    const navDrawer = document.getElementById('nav-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.nav-drawer__link, .nav-drawer__footer a');

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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDrawer && navDrawer.classList.contains('active')) {
            closeDrawer();
        }
    });

    // ----------------------------------------------------------------------
    // 2. Interactive Globe Controller & Smooth Section Tracking
    // ----------------------------------------------------------------------
    const globeContainer = document.getElementById('globe-container');
    const scrollProgressFill = document.getElementById('scroll-progress-fill');
    const header = document.getElementById('header');
    const sideNavItems = document.querySelectorAll('.side-nav__item');
    const headerNavLinks = document.querySelectorAll('.nav__link');

    // Section positions for the 3D Holographic Globe
    const globePositions = [
        { top: 48, left: 78, scale: 1.35, opacity: 0.85 }, // Section 0 (Hero): Right side balanced
        { top: 32, left: 22, scale: 1.1,  opacity: 0.75 }, // Section 1 (Experiências): Left side
        { top: 20, left: 82, scale: 1.4,  opacity: 0.65 }, // Section 2 (Personagens): Right top
        { top: 50, left: 18, scale: 1.0,  opacity: 0.60 }, // Section 3 (Eventos): Left center
        { top: 35, left: 80, scale: 1.2,  opacity: 0.55 }, // Section 4 (Diferenciais): Right subtle
        { top: 50, left: 50, scale: 1.8,  opacity: 0.35 }, // Section 5 (Cotação): Center large backdrop
    ];

    const sections = [
        document.getElementById('inicio'),
        document.getElementById('experiencias'),
        document.getElementById('personagens'),
        document.getElementById('eventos'),
        document.getElementById('diferenciais'),
        document.getElementById('cotacao')
    ].filter(Boolean);

    let activeSectionIndex = 0;
    let ticking = false;

    function updateScrollState() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 1. Barra de progresso superior
        if (scrollProgressFill && docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            scrollProgressFill.style.width = Math.min(Math.max(progress, 0), 100) + '%';
        }

        // 2. Header blur/scrolled
        if (header) {
            if (scrollTop > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // 3. Detecção da seção ativa mais próxima do centro da tela
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        sections.forEach((sec, idx) => {
            const rect = sec.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const dist = Math.abs(sectionCenter - viewportCenter);
            if (dist < minDistance) {
                minDistance = dist;
                closestIndex = idx;
            }
        });

        if (closestIndex !== activeSectionIndex) {
            activeSectionIndex = closestIndex;

            // Atualizar Globo 3D
            if (globeContainer && globePositions[activeSectionIndex]) {
                const pos = globePositions[activeSectionIndex];
                if (window.innerWidth > 1024) {
                    globeContainer.style.transform = `translate3d(${pos.left}vw, ${pos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${pos.scale}, ${pos.scale}, 1)`;
                    globeContainer.style.opacity = pos.opacity;
                }
            }

            // Atualizar Side Nav
            sideNavItems.forEach((item, idx) => {
                if (idx === activeSectionIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Atualizar Header Links
            if (sections[activeSectionIndex]) {
                const activeId = sections[activeSectionIndex].id;
                headerNavLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === '#' + activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollState();

    // ----------------------------------------------------------------------
    // 3. Catálogo de Personagens — Filtros por Categoria
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-pill');
    const characterCards = document.querySelectorAll('.character-card');

    if (filterButtons.length > 0 && characterCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                characterCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

});
