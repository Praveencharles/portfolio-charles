/* =========================================
   CROSSHAIR
========================================= */

const container =
    document.querySelector(".crosshair-container");

const horizontal =
    document.querySelector(".line-horizontal");

const vertical =
    document.querySelector(".line-vertical");

if (container && horizontal && vertical) {

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;


    /* -----------------------------------------
       MOUSE POSITION
    ----------------------------------------- */

    container.addEventListener("mousemove", (event) => {

        const rect =
            container.getBoundingClientRect();

        mouseX =
            event.clientX - rect.left;

        mouseY =
            event.clientY - rect.top;

    });


    /* -----------------------------------------
       SHOW
    ----------------------------------------- */

    container.addEventListener("mouseenter", () => {

        gsap.to(
            [horizontal, vertical],
            {
                opacity: 1,
                duration: 0.25,
                ease: "power2.out"
            }
        );

    });


    /* -----------------------------------------
       HIDE
    ----------------------------------------- */

    container.addEventListener("mouseleave", () => {

        gsap.to(
            [horizontal, vertical],
            {
                opacity: 0,
                duration: 0.25,
                ease: "power2.out"
            }
        );

    });


    /* -----------------------------------------
       SMOOTH MOVEMENT
    ----------------------------------------- */

    function animateCrosshair() {

        currentX +=
            (mouseX - currentX) * 0.15;

        currentY +=
            (mouseY - currentY) * 0.15;


        gsap.set(vertical, {
            x: currentX
        });

        gsap.set(horizontal, {
            y: currentY
        });


        requestAnimationFrame(
            animateCrosshair
        );

    }


    gsap.set(
        [horizontal, vertical],
        {
            opacity: 0
        }
    );


    animateCrosshair();

}


/* =========================================
   CROSSHAIR DISTORTION
========================================= */

const filterX =
    document.querySelector("#filterX");

const filterY =
    document.querySelector("#filterY");

if (
    container &&
    horizontal &&
    vertical &&
    filterX &&
    filterY
) {

    const turbulence = {
        value: 0
    };


    const distortion =
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
                    turbulence.value
                );

                filterY.setAttribute(
                    "baseFrequency",
                    turbulence.value
                );

            },

            onComplete: () => {

                horizontal.style.filter = "none";

                vertical.style.filter = "none";

            }
        });


    distortion.to(
        turbulence,
        {
            value: 0,
            duration: 0.5,
            startAt: {
                value: 1
            },
            ease: "power1.out"
        }
    );


    const links =
        container.querySelectorAll("a");


    links.forEach((link) => {

        link.addEventListener(
            "mouseenter",
            () => {

                distortion.restart();

            }
        );


        link.addEventListener(
            "mouseleave",
            () => {

                distortion.progress(1);

            }
        );

    });

}


/* =========================================
   STAGGERED MENU
========================================= */

const menuToggle =
    document.querySelector("#menuToggle");

const menuOverlay =
    document.querySelector("#menuOverlay");

const menuPanel =
    document.querySelector(".menu-panel");

const menuLabels =
    document.querySelectorAll(".menu-label");

const menuLinks =
    document.querySelectorAll(".menu-link");


let menuOpen = false;


/* -----------------------------------------
   INITIAL STATE
----------------------------------------- */

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


/* -----------------------------------------
   OPEN MENU
----------------------------------------- */

function openMenu() {

    if (
        !menuToggle ||
        !menuOverlay ||
        !menuPanel
    ) {
        return;
    }


    menuOpen = true;


    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );


    document.body.classList.add(
        "menu-open"
    );


    const tl =
        gsap.timeline();


    tl.set(menuOverlay, {
        visibility: "visible",
        pointerEvents: "auto",
        opacity: 1
    });


    tl.to(menuPanel, {
        x: "0%",
        duration: 0.7,
        ease: "power4.out"
    });


    tl.to(
        menuLabels,
        {
            y: "0%",
            opacity: 1,

            duration: 0.6,

            stagger: 0.08,

            ease: "power4.out"
        },
        "-=0.35"
    );

}


/* -----------------------------------------
   CLOSE MENU
========================================= */

function closeMenu() {

    if (
        !menuOverlay ||
        !menuPanel
    ) {
        return;
    }


    menuOpen = false;


    if (menuToggle) {

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    const tl =
        gsap.timeline();


    tl.to(
        menuLabels,
        {
            y: "100%",
            opacity: 0,

            duration: 0.3,

            stagger: 0.05,

            ease: "power3.in"
        }
    );


    tl.to(
        menuPanel,
        {
            x: "100%",

            duration: 0.5,

            ease: "power3.inOut"
        },
        "-=0.1"
    );


    tl.set(menuOverlay, {
        visibility: "hidden",
        pointerEvents: "none"
    });


    document.body.classList.remove(
        "menu-open"
    );

}


/* -----------------------------------------
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


/* -----------------------------------------
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


/* -----------------------------------------
   ESCAPE
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

const logoLoop =
    document.querySelector("#logoLoop");

if (logoLoop) {

    const logoTrack =
        logoLoop.querySelector(
            ".logo-loop-track"
        );


    const firstLogoList =
        logoTrack
            ? logoTrack.querySelector(
                ".logo-list"
            )
            : null;


    let position = 0;

    let lastTime = null;

    let isHovered = false;


    /* -----------------------------------------
       SPEED
    ----------------------------------------- */

    const speed = 100;


    let sequenceWidth =
        firstLogoList
            ? firstLogoList.offsetWidth
            : 0;


    /* -----------------------------------------
       UPDATE SIZE
    ----------------------------------------- */

    function updateLogoLoopSize() {

        if (!firstLogoList) {
            return;
        }


        sequenceWidth =
            firstLogoList.offsetWidth;


        if (
            sequenceWidth > 0 &&
            position >= sequenceWidth
        ) {

            position =
                position % sequenceWidth;

        }

    }


    window.addEventListener(
        "resize",
        updateLogoLoopSize
    );


    /* -----------------------------------------
       HOVER PAUSE
    ----------------------------------------- */

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


    /* -----------------------------------------
       ANIMATION
    ----------------------------------------- */

    function animateLogoLoop(timestamp) {

        if (lastTime === null) {

            lastTime = timestamp;

        }


        const deltaTime =
            Math.min(
                timestamp - lastTime,
                50
            );


        lastTime = timestamp;


        if (!isHovered) {

            position +=
                speed *
                (deltaTime / 1000);

        }


        /* Infinite loop */

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

    }


    updateLogoLoopSize();


    requestAnimationFrame(
        animateLogoLoop
    );

}