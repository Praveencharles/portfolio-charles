/* =========================================
   CROSSHAIR
========================================= */

const container = document.querySelector(".crosshair-container");
const horizontal = document.querySelector(".line-horizontal");
const vertical = document.querySelector(".line-vertical");

const filterX = document.querySelector("#filterX");
const filterY = document.querySelector("#filterY");

let mouse = {
  x: 0,
  y: 0
};

const lerp = (a, b, n) => {
  return (1 - n) * a + n * b;
};


/* =========================================
   GET MOUSE POSITION
========================================= */

const getMousePosition = (event) => {

  const bounds = container.getBoundingClientRect();

  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
  };

};


/* =========================================
   MOUSE MOVE
========================================= */

container.addEventListener("mousemove", (event) => {

  mouse = getMousePosition(event);

});


/* =========================================
   CROSSHAIR SMOOTHING
========================================= */

const renderedStyles = {

  tx: {
    previous: 0,
    current: 0,
    amt: 0.15
  },

  ty: {
    previous: 0,
    current: 0,
    amt: 0.15
  }

};


/* =========================================
   SHOW CROSSHAIR
========================================= */

container.addEventListener("mouseenter", () => {

  gsap.to(
    [horizontal, vertical],
    {
      opacity: 1,
      duration: 0.4,
      ease: "power3.out"
    }
  );

});


/* =========================================
   HIDE CROSSHAIR
========================================= */

container.addEventListener("mouseleave", () => {

  gsap.to(
    [horizontal, vertical],
    {
      opacity: 0,
      duration: 0.4,
      ease: "power3.out"
    }
  );

});


/* =========================================
   CROSSHAIR RENDER
========================================= */

const renderCrosshair = () => {

  renderedStyles.tx.current = mouse.x;
  renderedStyles.ty.current = mouse.y;


  renderedStyles.tx.previous = lerp(
    renderedStyles.tx.previous,
    renderedStyles.tx.current,
    renderedStyles.tx.amt
  );


  renderedStyles.ty.previous = lerp(
    renderedStyles.ty.previous,
    renderedStyles.ty.current,
    renderedStyles.ty.amt
  );


  gsap.set(vertical, {
    x: renderedStyles.tx.previous
  });


  gsap.set(horizontal, {
    y: renderedStyles.ty.previous
  });


  requestAnimationFrame(renderCrosshair);

};


/* =========================================
   INITIAL CROSSHAIR STATE
========================================= */

gsap.set(
  [horizontal, vertical],
  {
    opacity: 0
  }
);


/* Start animation */

renderCrosshair();



/* =========================================
   CROSSHAIR DISTORTION
========================================= */

const primitiveValues = {
  turbulence: 0
};


const distortionTimeline = gsap.timeline({

  paused: true,

  onStart: () => {

    if (horizontal) {
      horizontal.style.filter = "url(#filter-noise-x)";
    }

    if (vertical) {
      vertical.style.filter = "url(#filter-noise-y)";
    }

  },

  onUpdate: () => {

    if (filterX) {

      filterX.setAttribute(
        "baseFrequency",
        primitiveValues.turbulence
      );

    }


    if (filterY) {

      filterY.setAttribute(
        "baseFrequency",
        primitiveValues.turbulence
      );

    }

  },

  onComplete: () => {

    if (horizontal) {
      horizontal.style.filter = "none";
    }

    if (vertical) {
      vertical.style.filter = "none";
    }

  }

});


distortionTimeline.to(
  primitiveValues,
  {
    duration: 0.5,

    turbulence: 0,

    startAt: {
      turbulence: 1
    },

    ease: "power1.out"
  }
);



/* =========================================
   LINK DISTORTION
========================================= */

const links = container.querySelectorAll("a");


links.forEach((link) => {

  link.addEventListener("mouseenter", () => {

    distortionTimeline.restart();

  });


  link.addEventListener("mouseleave", () => {

    distortionTimeline.progress(1);

  });

});



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

if (menuPanel) {

  gsap.set(menuPanel, {
    x: "100%"
  });

}


if (menuLabels.length) {

  gsap.set(menuLabels, {
    y: "100%",
    opacity: 0
  });

}


/* =========================================
   OPEN MENU
========================================= */

const openMenu = () => {

  if (menuOpen) return;

  menuOpen = true;


  menuToggle.setAttribute(
    "aria-expanded",
    "true"
  );


  document.body.classList.add("menu-open");


  const timeline = gsap.timeline();


  timeline.set(
    menuOverlay,
    {
      visibility: "visible",
      pointerEvents: "auto",
      opacity: 1
    }
  );


  timeline.to(
    menuPanel,
    {
      x: "0%",
      duration: 0.7,
      ease: "power4.out"
    }
  );


  timeline.to(
    menuLabels,
    {
      y: "0%",
      opacity: 1,
      duration: 0.7,
      stagger: 0.08,
      ease: "power4.out"
    },
    "-=0.4"
  );

};



/* =========================================
   CLOSE MENU
========================================= */

const closeMenu = () => {

  if (!menuOpen) return;

  menuOpen = false;


  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );


  const timeline = gsap.timeline();


  timeline.to(
    menuLabels,
    {
      y: "100%",
      opacity: 0,
      duration: 0.35,
      stagger: 0.05,
      ease: "power3.in"
    }
  );


  timeline.to(
    menuPanel,
    {
      x: "100%",
      duration: 0.55,
      ease: "power3.inOut"
    },
    "-=0.1"
  );


  timeline.set(
    menuOverlay,
    {
      visibility: "hidden",
      pointerEvents: "none"
    }
  );


  document.body.classList.remove("menu-open");

};



/* =========================================
   MENU BUTTON
========================================= */

if (menuToggle) {

  menuToggle.addEventListener(
    "click",
    () => {

      if (menuOpen) {

        closeMenu();

      } else {

        openMenu();

      }

    }
  );

}



/* =========================================
   MENU LINKS
========================================= */

menuLinks.forEach((link) => {

  link.addEventListener(
    "click",
    () => {

      closeMenu();

    }
  );

});



/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      menuOpen
    ) {

      closeMenu();

    }

  }
);



/* =========================================
   LOGO LOOP
========================================= */

const logoLoop = document.querySelector("#logoLoop");

const logoTrack = logoLoop
  ? logoLoop.querySelector(".logo-loop-track")
  : null;


let position = 0;
let lastTime = null;
let isHovered = false;


/*
   Logo Loop speed
   Increase this value for faster movement.
*/

const speed = 100;


/*
   First logo list is used
   as the repeating sequence.
*/

const firstLogoList = logoTrack
  ? logoTrack.querySelector(".logo-list")
  : null;


let sequenceWidth = 0;


if (firstLogoList) {

  sequenceWidth = firstLogoList.offsetWidth;

}



/* =========================================
   UPDATE LOGO LOOP SIZE
========================================= */

const updateLogoLoopSize = () => {

  if (!firstLogoList) return;


  sequenceWidth =
    firstLogoList.offsetWidth;


  if (
    sequenceWidth > 0 &&
    position >= sequenceWidth
  ) {

    position =
      position % sequenceWidth;

  }

};


window.addEventListener(
  "resize",
  updateLogoLoopSize
);



/* =========================================
   LOGO LOOP HOVER
========================================= */

if (logoLoop) {

  logoLoop.addEventListener(
    "mouseenter",
    () => {

      isHovered = true;

    }
  );


  logoLoop.addEventListener(
    "mouseleave",
    () => {

      isHovered = false;

    }
  );

}



/* =========================================
   LOGO LOOP ANIMATION
========================================= */

const animateLogoLoop = (timestamp) => {

  if (lastTime === null) {

    lastTime = timestamp;

  }


  const deltaTime = Math.min(
    timestamp - lastTime,
    50
  );


  lastTime = timestamp;


  /*
     Pause when mouse is over
     the logo loop.
  */

  if (!isHovered) {

    position +=
      speed *
      (deltaTime / 1000);

  }


  /*
     Seamless infinite loop.
  */

  if (
    sequenceWidth > 0 &&
    position >= sequenceWidth
  ) {

    position -= sequenceWidth;

  }


  if (logoTrack) {

    logoTrack.style.transform =
      `translate3d(${-position}px, 0, 0)`;

  }


  requestAnimationFrame(
    animateLogoLoop
  );

};



/* =========================================
   START LOGO LOOP
========================================= */

updateLogoLoopSize();

requestAnimationFrame(
  animateLogoLoop
);