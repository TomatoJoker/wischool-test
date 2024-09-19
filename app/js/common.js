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