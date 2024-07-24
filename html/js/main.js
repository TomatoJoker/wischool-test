"use strict";

dynamicHeightToolbar();
window.addEventListener("resize", function () {
  dynamicHeightToolbar();
});
function dynamicHeightToolbar() {
  if (window.innerWidth < 1200) {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
  } else {
    document.documentElement.style.removeProperty('--vh');
  }
} // calc window height without toolbar on mobile browser