function createCarousel(root) {
    const rail = root.querySelector(".carousel__rail");
    const pager = root.querySelector(".carousel__pager");
    const originals = Array.from(rail.children);
    const total = originals.length;

    let index = 1;       // 0 and total + 1 are the cloned photos
    let locked = false;  // true while a slide is still moving

    // Clone the last photo for the front and the first photo for the back
    const frontClone = originals[total - 1].cloneNode(true);
    const backClone = originals[0].cloneNode(true);
    [frontClone, backClone].forEach((clone) => {
        clone.alt = "";
        clone.setAttribute("aria-hidden", "true");
    });
    rail.prepend(frontClone);
    rail.append(backClone);

    // One pager button for every real photo
    const bullets = originals.map((_, n) => {
        const bullet = document.createElement("button");
        bullet.type = "button";
        bullet.setAttribute("aria-label", `Show photo ${n + 1} of ${total}`);
        bullet.addEventListener("click", () => slideTo(n + 1));
        return bullet;
    });
    pager.append(...bullets);

    // Write the position to the rail and mark the matching bullet
    function paint() {
        rail.style.setProperty("--index", index);
        const real = (index - 1 + total) % total;
        bullets.forEach((bullet, n) => {
            bullet.setAttribute("aria-current", String(n === real));
        });
    }

    // Animated move
    function slideTo(target) {
        if (locked || target === index) return;
        locked = true;
        index = target;
        paint();
    }

    // Instant move without animation
    function snapTo(target) {
        rail.classList.add("is-instant");
        index = target;
        paint();
        void rail.offsetWidth;            // apply the change right now
        rail.classList.remove("is-instant");
        locked = false;
    }

    // After a slide ends, leave the clones and land on the real photo
    rail.addEventListener("transitionend", (event) => {
        if (event.target !== rail || event.propertyName !== "transform") return;

        if (index === total + 1) snapTo(1);
        else if (index === 0) snapTo(total);
        else locked = false;
    });

    root.querySelector(".carousel__arrow--left")
        .addEventListener("click", () => slideTo(index - 1));
    root.querySelector(".carousel__arrow--right")
        .addEventListener("click", () => slideTo(index + 1));

    root.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") slideTo(index - 1);
        if (event.key === "ArrowRight") slideTo(index + 1);
    });

    snapTo(1);   // start on the first real photo
}

document.querySelectorAll("[data-carousel]").forEach(createCarousel);