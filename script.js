
/* =========================================
   CROSSHAIR
========================================= */

const container =
  document.querySelector(".crosshair-container");

const horizontal =
  document.querySelector(".line-horizontal");

const vertical =
  document.querySelector(".line-vertical");

const filterX =
  document.querySelector("#filterX");

const filterY =
  document.querySelector("#filterY");


let mouse = {
  x: 0,
  y: 0
};


const lerp = (a, b, n) =>
  (1 - n) * a + n * b;


const getMousePosition = (event) => {

  const bounds =
    container.getBoundingClientRect();

  return {

    x: event.clientX - bounds.left,

    y: event.clientY - bounds.top

  };

};


container.addEventListener(
  "mousemove",
  (event) => {

    mouse =
      getMousePosition(event);

  }
);


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


container.addEventListener(
  "mouseenter",
  () => {

    gsap.to(
      [horizontal, vertical],
      {
        opacity: 1,

        duration: 0.5,

        ease: "power3.out"
      }
    );

  }
);


const renderCrosshair = () => {

  renderedStyles.tx.current =
    mouse.x;

  renderedStyles.ty.current =
    mouse.y;


  renderedStyles.tx.previous =
    lerp(
      renderedStyles.tx.previous,
      renderedStyles.tx.current,
      renderedStyles.tx.amt
    );


  renderedStyles.ty.previous =
    lerp(
      renderedStyles.ty.previous,
      renderedStyles.ty.current,
      renderedStyles.ty.amt
    );


  gsap.set(
    vertical,
    {
      x: renderedStyles.tx.previous
    }
  );


  gsap.set(
    horizontal,
    {
      y: renderedStyles.ty.previous
    }
  );


  requestAnimationFrame(
    renderCrosshair
  );

};


gsap.set(
  [horizontal, vertical],
  {
    opacity: 0
  }
);


renderCrosshair();



/* =========================================
   CROSSHAIR DISTORTION
========================================= */

const primitiveValues = {

  turbulence: 0

};


const distortionTimeline =
  gsap.timeline({

    paused: true,

    onStart: () => {

      horizontal.style.filter =
        "url(#filter-noise-x)";

      vertical.style.filter =
        "url(#filter-noise-y)";

    },

    onUpdate: () => {

      filterX.setAttribute(
        "baseFrequency",
        primitiveValues.turbulence
      );

      filterY.setAttribute(
        "baseFrequency",
        primitiveValues.turbulence
      );

    },

    onComplete: () => {

      horizontal.style.filter =
        "none";

      vertical.style.filter =
        "none";

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

    ease: "power1"

  }
);


const links =
  container.querySelectorAll("a");


links.forEach((link) => {

  link.addEventListener(
    "mouseenter",
    () => {

      distortionTimeline.restart();

    }
  );


  link.addEventListener(
    "mouseleave",
    () => {

      distortionTimeline.progress(1);

    }
  );

});



/* =========================================
   LOGO LOOP
========================================= */

const logoLoop =
  document.querySelector("#logoLoop");

const logoTrack =
  logoLoop.querySelector(
    ".logo-loop-track"
  );


let position = 0;

let lastTime = null;

let isHovered = false;


/*
   Logo Loop settings
*/

const speed = 100;


/*
   The first logo list is used
   as the repeating sequence.
*/

const firstLogoList =
  logoTrack.querySelector(
    ".logo-list"
  );


let sequenceWidth =
  firstLogoList.offsetWidth;



/* =========================================
   RESIZE
========================================= */

const updateLogoLoopSize = () => {

  sequenceWidth =
    firstLogoList.offsetWidth;


  if (position > sequenceWidth) {

    position =
      position % sequenceWidth;

  }

};


window.addEventListener(
  "resize",
  updateLogoLoopSize
);



/* =========================================
   HOVER
========================================= */

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



/* =========================================
   ANIMATION
========================================= */

const animateLogoLoop =
  (timestamp) => {

    if (lastTime === null) {

      lastTime =
        timestamp;

    }


    const deltaTime =
      Math.min(
        timestamp - lastTime,
        50
      );


    lastTime =
      timestamp;


    /*
       Pause on hover.
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

      position -=
        sequenceWidth;

    }


    logoTrack.style.transform =
      `translate3d(${-position}px, 0, 0)`;


    requestAnimationFrame(
      animateLogoLoop
    );

  };


updateLogoLoopSize();


requestAnimationFrame(
  animateLogoLoop
);
