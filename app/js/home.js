const sortBtn = document.querySelector('.sort__top'),
    sort = document.querySelector('.sort')

sortBtn.addEventListener('click', () => {
    sort.classList.toggle('sort--active');
});


const swiper = new Swiper(".js-categories-slider", {
    breakpoints: {
        320: {
            slidesPerView: 3,
            spaceBetween: 16
        },
        768: {
            slidesPerView: 4,
            spaceBetween: 32
        }
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});