function showTab(tab) {
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('panel-' + tab).classList.remove('hidden');
    document.getElementById('tab-' + tab).classList.add('active');
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 100);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = target * eased;
            if (target >= 1000) {
                el.textContent = Math.floor(current).toLocaleString('tr-TR') + suffix;
            } else if (isDecimal) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { animateCounters(); counterObs.disconnect(); }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});

Fancybox.bind("[data-fancybox]", {
    infinite: true,
    preload: 3,
    Thumbs: {
        autoStart: true,
    }
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const mainPopup = document.getElementById('popup-main');
        if (mainPopup) {
            showModal(mainPopup);
        }
    }, 2500);

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                hideModal(backdrop);
            }
        });
    });
});

function showModal(modalElement) {
    document.body.classList.add('overflow-hidden');
    modalElement.classList.remove('hidden');
    modalElement.classList.add('flex');

    void modalElement.offsetWidth;

    modalElement.classList.remove('opacity-0');
    modalElement.classList.add('opacity-100');

    const content = modalElement.querySelector('.modal-content');
    if (content) {
        content.classList.remove('animate-pop-out');
        content.classList.add('animate-pop');
    }
}

function handlePopup(answer) {
    const mainPopup = document.getElementById('popup-main');

    hideModal(mainPopup);

    setTimeout(() => {
        const nextPopup = document.getElementById(answer === 'yes' ? 'popup-yes' : 'popup-no');
        if (nextPopup) {
            showModal(nextPopup);
        }
    }, 300);
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) hideModal(popup);
}

function hideModal(modalElement) {
    const content = modalElement.querySelector('.modal-content');

    if (content) {
        content.classList.remove('animate-pop');
        content.classList.add('animate-pop-out');
    }

    modalElement.classList.remove('opacity-100');
    modalElement.classList.add('opacity-0');

    setTimeout(() => {
        modalElement.classList.add('hidden');
        modalElement.classList.remove('flex');

        const visibleModals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
        if (visibleModals.length === 0) {
            document.body.classList.remove('overflow-hidden');
        }
    }, 300);
}