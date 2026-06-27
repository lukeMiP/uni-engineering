jQuery(window).on('load', function() {

    $(".preloader").addClass("preloader-hidden");

    setTimeout(function(){

        $(".hero .animation-container").each(function(){

            var e = $(this);

            setTimeout(function(){

                e.addClass("run-animation");

            }, e.data("animation-delay") );

        });

    }, 900 );

});


jQuery(document).ready(function($) {
    "use strict";

    function typeGreeting() {
        var target = document.getElementById("typing-greeting");
        var text = "Hi, I'm Luke";
        var index = 0;

        if (!target) return;

        target.textContent = "";

        function typeNext() {
            target.textContent = text.slice(0, index);
            index += 1;

            if (index <= text.length) {
                window.setTimeout(typeNext, 82);
            }
        }

        window.setTimeout(typeNext, 350);
    }

    typeGreeting();

    if ($(".hero .background-content.parallax-on").length && $.fn.parallax) {
        $(".hero .background-content.parallax-on").parallax({
            scalarX: 12,
            scalarY: 8,
            frictionX: 0.12,
            frictionY: 0.12
        });
    }

    $(".scroll-top").click(function() {
        $("html, body").animate({ scrollTop: 0 }, 400);
        return false;
    });

    if (window.ScrollReveal) {
        window.sr = ScrollReveal();
        sr.reveal(".scroll-animated-from-bottom", {
            duration: 650,
            delay: 180,
            origin: "bottom",
            rotate: { x: 0, y: 0, z: 0 },
            opacity: 0,
            distance: "8rem",
            viewFactor: 0.22,
            scale: 1,
            useDelay: "onload"
        });
    }

    if ($.fn.owlCarousel) {
        $(".image-carousel").owlCarousel({
            center: true,
            items: 1,
            loop: true,
            margin: 18,
            autoplay: true,
            autoplayTimeout: 3600,
            autoplayHoverPause: true,
            responsive:{
                800:{
                    items: 2
                }
            }
        });
    }

    function onScrollAnimating() {
        var hero = $(".hero");
        if (!hero.length) return;

        var windowHeight = hero.height(),
            frontContent = $(".hero .front-content"),
            backContent = $(".hero .background-content"),
            navigationButton = $(".navigation-button"),
            scrollOffset,
            calculatedOpacityFrontContent,
            calculatedScaleFrontContent,
            calculatedTranslateHeader,
            calculatedOpacityBackground;

        function navigationButtonHide() {
            if (calculatedTranslateHeader <= 200) {
                navigationButton.css("transform", "translateX(" + calculatedTranslateHeader + "%) translateY(-50%)");
            } else if (scrollOffset > windowHeight) {
                navigationButton.css("transform", "translateX(200%) translateY(-50%)");
            }
        }

        function frontContentMargin() {
            frontContent.css("margin-top", Math.min(scrollOffset, windowHeight));
        }

        function frontContentOpacity() {
            frontContent.css("opacity", Math.max(calculatedOpacityFrontContent, 0));
        }

        function frontContentScale() {
            frontContent.css("transform", "scale(" + Math.max(calculatedScaleFrontContent, 0.6) + ")");
        }

        function backgroundOpacity() {
            backContent.css("opacity", Math.max(calculatedOpacityBackground, 0));
        }

        function runStep() {
            scrollOffset = $(window).scrollTop();

            if (windowHeight > scrollOffset && scrollOffset >= 0) {
                calculatedTranslateHeader = (scrollOffset / windowHeight) * 650;
                calculatedOpacityFrontContent = 1 - (scrollOffset / windowHeight) * 4.2;
                calculatedScaleFrontContent = 1 - (scrollOffset / windowHeight) * 1.2;
                calculatedOpacityBackground = 1 - (scrollOffset / windowHeight) * 1.4;

                navigationButtonHide();
                frontContentMargin();
                frontContentOpacity();
                frontContentScale();
                backgroundOpacity();
            }
        }

        $(window).on("resize", function(){
            windowHeight = hero.height();
            runStep();
        });

        $(window).scroll(runStep);
        runStep();
    }

    onScrollAnimating();
});


(function() {
    "use strict";

    var canvas = document.getElementById("pixel-wave");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var reducedMotion = mediaQuery.matches;
    var width = 0;
    var height = 0;
    var dpr = 1;
    var cell = 5;
    var columns = 0;
    var rows = 0;
    var time = 0;
    var animationId = null;
    var pointer = { x: -9999, y: -9999, active: false };
    var ripples = [];

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        cell = width < 700 ? 6 : 5;
        columns = Math.ceil(width / cell) + 1;
        rows = Math.ceil(height / cell) + 1;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
    }

    function addRipple(x, y, strength) {
        ripples.push({
            x: x,
            y: y,
            age: 0,
            life: reducedMotion ? 24 : 72,
            strength: strength || 1
        });

        if (ripples.length > 5) {
            ripples.shift();
        }
    }

    function interactionWarp(x, y) {
        var total = 0;

        if (pointer.active) {
            var pdx = x - pointer.x;
            var pdy = y - pointer.y;
            var pointerDistance = Math.sqrt(pdx * pdx + pdy * pdy);
            var pointerFalloff = Math.max(0, 1 - pointerDistance / 260);
            total += Math.sin(pointerDistance * 0.055 - time * 0.05) * pointerFalloff * 18;
        }

        for (var i = 0; i < ripples.length; i++) {
            var ripple = ripples[i];
            var dx = x - ripple.x;
            var dy = y - ripple.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var radius = ripple.age * 8;
            var ring = Math.sin((distance - radius) * 0.06);
            var envelope = Math.max(0, 1 - Math.abs(distance - radius) / 150);
            var fade = Math.max(0, 1 - ripple.age / ripple.life);
            total += ring * envelope * fade * ripple.strength * 34;
        }

        return total;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#020302";
        ctx.fillRect(0, 0, width, height);

        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < columns; x++) {
                var px = x * cell;
                var py = y * cell;
                var nx = px / Math.max(width, 1);
                var ny = py / Math.max(height, 1);
                var sweep = Math.sin(nx * 8.2 + ny * 4.8 + time * 0.012) * 54;
                var fold = Math.sin(nx * 18.5 - ny * 7.4 + time * 0.018) * 22;
                var drift = Math.cos((nx - ny) * 12 + time * 0.009) * 16;
                var warp = interactionWarp(px, py);
                var stripeCoordinate = px + sweep + fold + drift + warp;
                var stripe = Math.sin(stripeCoordinate * 0.105);
                var softStripe = Math.sin((stripeCoordinate + py * 0.2) * 0.052);
                var mask = Math.sin(nx * 5.3 - ny * 7.6 + time * 0.006);
                var vignetteX = 1 - Math.abs(nx - 0.5) * 1.25;
                var vignetteY = 1 - Math.abs(ny - 0.5) * 1.05;
                var vignette = Math.max(0, Math.min(vignetteX, vignetteY));
                var value = ((stripe > 0.2 ? 1 : 0) * 0.72) + ((softStripe > 0.58 ? 1 : 0) * 0.28);

                value *= 0.36 + (mask + 1) * 0.28;
                value *= 0.48 + vignette * 0.64;

                if (value > 0.22) {
                    var alpha = Math.min(0.86, value);
                    var blockWidth = Math.max(1, cell - 1);
                    var blockHeight = Math.max(1, cell - 1);

                    ctx.fillStyle = "rgba(245, 255, 240, " + alpha + ")";
                    ctx.fillRect(px, py, blockWidth, blockHeight);
                }
            }
        }

        ctx.fillStyle = "rgba(47, 191, 74, 0.045)";
        for (var scan = 0; scan < height; scan += 7) {
            ctx.fillRect(0, scan, width, 1);
        }
    }

    function tick() {
        time += reducedMotion ? 0.2 : 1;

        for (var i = ripples.length - 1; i >= 0; i--) {
            ripples[i].age += reducedMotion ? 3 : 1;
            if (ripples[i].age > ripples[i].life) {
                ripples.splice(i, 1);
            }
        }

        draw();

        if (!reducedMotion) {
            animationId = window.requestAnimationFrame(tick);
        }
    }

    function start() {
        if (animationId) {
            window.cancelAnimationFrame(animationId);
        }

        draw();

        if (!reducedMotion) {
            animationId = window.requestAnimationFrame(tick);
        }
    }

    function onPointerMove(event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;

        if (reducedMotion) {
            draw();
        }
    }

    function onPointerLeave() {
        pointer.active = false;
    }

    function onPointerDown(event) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
        addRipple(event.clientX, event.clientY, 1);

        if (reducedMotion) {
            tick();
        }
    }

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", function(event) {
            reducedMotion = event.matches;
            start();
        });
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    resize();
    addRipple(width * 0.58, height * 0.5, 0.5);
    start();
})();
