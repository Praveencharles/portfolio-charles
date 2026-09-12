/* =========================================
   CROSSHAIR
========================================= */

const container = document.querySelector(".crosshair-container");
const horizontal = document.querySelector(".line-horizontal");
const vertical = document.querySelector(".line-vertical");

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;


/* Mouse position */
container.addEventListener("mousemove", (e) => {

  const rect = container.getBoundingClientRect();

  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;

});


/* Show crosshair */
container.addEventListener("mouseenter", () => {

  gsap.to(horizontal, {
    opacity: 1,
    duration: 0.2
  });

  gsap.to(vertical, {
    opacity: 1,
    duration: 0.2
  });

});


/* Hide crosshair */
container.addEventListener("mouseleave", () => {

  gsap.to(horizontal, {
    opacity: 0,
    duration: 0.2
  });

  gsap.to(vertical, {
    opacity: 0,
    duration: 0.2
  });

});


/* Smooth movement */
function animateCrosshair() {

  currentX += (mouseX - currentX) * 0.15;
  currentY += (mouseY - currentY) * 0.15;

  gsap.set(vertical, {
    x: currentX
  });

  gsap.set(horizontal, {
    y: currentY
  });

  requestAnimationFrame(animateCrosshair);
}

animateCrosshair();


/* =========================================
   STAGGERED MENU
========================================= */

const menuToggle = document.querySelector("#menuToggle");
const menuOverlay = document.querySelector("#menuOverlay");
const menuPanel = document.querySelector(".menu-panel");
const menuLabels = document.querySelectorAll(".menu-label");
const menuLinks = document.querySelectorAll(".menu-link");

let menuOpen = false;


/* Initial menu state */
gsap.set(menuPanel, {
  x: "100%"
});

gsap.set(menuLabels, {
  y: 100,
  opacity: 0
});


function openMenu() {

  menuOpen = true;

  menuOverlay.classList.add("menu-open");

  menuToggle.setAttribute("aria-expanded", "true");

  gsap.to(menuPanel, {
    x: "0%",
    duration: 0.8,
    ease: "power4.out"
  });

  gsap.to(menuLabels, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.08,
    delay: 0.25,
    ease: "power3.out"
  });

}


function closeMenu() {

  menuOpen = false;

  gsap.to(menuLabels, {
    y: 100,
    opacity: 0,
    duration: 0.4,
    stagger: 0.04,
    ease: "power2.in"
  });

  gsap.to(menuPanel, {
    x: "100%",
    duration: 0.7,
    delay: 0.1,
    ease: "power4.in",
    onComplete: () => {
      menuOverlay.classList.remove("menu-open");
    }
  });

  menuToggle.setAttribute("aria-expanded", "false");

}


menuToggle.addEventListener("click", () => {

  if (menuOpen) {
    closeMenu();
  } else {
    openMenu();
  }

});


menuLinks.forEach((link) => {

  link.addEventListener("click", () => {
    closeMenu();
  });

});


document.addEventListener("keydown", (e) => {

  if (e.key === "Escape" && menuOpen) {
    closeMenu();
  }

});


/* =========================================
   LOGO LOOP
========================================= */

const logoLoop = document.querySelector("#logoLoop");
const logoTrack = document.querySelector(".logo-loop-track");
const logoList = document.querySelector(".logo-list");

let logoPosition = 0;
let logoLastTime = performance.now();

const logoSpeed = 100;

let logoPaused = false;


logoLoop.addEventListener("mouseenter", () => {
  logoPaused = true;
});

logoLoop.addEventListener("mouseleave", () => {
  logoPaused = false;
});


function animateLogoLoop(time) {

  const delta = (time - logoLastTime) / 1000;
  logoLastTime = time;

  if (!logoPaused) {

    logoPosition += logoSpeed * delta;

    const sequenceWidth = logoList.offsetWidth;

    if (logoPosition >= sequenceWidth) {
      logoPosition = 0;
    }

    logoTrack.style.transform =
      `translate3d(${-logoPosition}px, 0, 0)`;
  }

  requestAnimationFrame(animateLogoLoop);
}


requestAnimationFrame(animateLogoLoop);