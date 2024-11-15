dynamicHeightToolbar()
window.addEventListener("resize", function () {
    dynamicHeightToolbar();
});

function dynamicHeightToolbar() {
    if (window.innerWidth < 1200) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    } else {
        document.documentElement.style.removeProperty('--vh');
    }
} // calc window height without toolbar on mobile browser

const body = document.querySelector('body'),
    btnModal = document.querySelectorAll('[data-modal-registration="btn"]'),
    modal = document.querySelector('[data-modal-registration="modal"]'),
    modalClose = document.querySelector('[data-modal-registration="modal-close"]'),
    burgerBtn = document.querySelector('[data-burger="btn"]'),
    burger = document.querySelector('[data-burger="menu"]'),
    passwordInput = document.querySelector('[data-password="input"]'),
    passwordBtn = document.querySelector('[data-password="btn"]');

btnModal.forEach((btn) => {
    btn.addEventListener('click', () => {
        modal.classList.add('modal--open');
    })
})

const closeModal = () => {
    modal.classList.remove('modal--open');
}

modal.addEventListener('click', (event) => {
    if (event.currentTarget === event.target) {
        closeModal();
    }
});

modalClose.addEventListener('click', (event) => {
    closeModal();
});

burgerBtn.addEventListener('click', (e) => {
    e.target.classList.toggle('header__burger--active');
    burger.classList.toggle('menu--open');
    body.classList.toggle('lock');

    const isExpanded = e.target.getAttribute('aria-expanded') === 'true';
    e.target.setAttribute('aria-expanded', !isExpanded);
})

const togglePassword = () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
}

passwordBtn.addEventListener('click', () => {
    togglePassword();
});

