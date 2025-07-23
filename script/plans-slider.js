// Infinite slider for data plans (1 item scroll, 1 clone on each side)
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('plans-slider-wrapper');
    const track = document.getElementById('plans-slider-track');

    let cardsPerSlide = 1;
    let currentIndex = 0;
    let isTransitioning = false;
    let originalItems = [];

    const getCardsPerSlide = () => {
        if (window.innerWidth >= 1200) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    const cloneBufferItems = () => {
        // Clean up previous clones
        Array.from(track.children).forEach(child => {
            if (child.classList.contains('clone')) {
                child.remove();
            }
        });

        originalItems = Array.from(track.children).filter(child => !child.classList.contains('clone'));

        const prependClones = originalItems.slice(-cardsPerSlide).map(el => {
            const clone = el.cloneNode(true);
            clone.classList.add('clone');
            return clone;
        });

        const appendClones = originalItems.slice(0, cardsPerSlide).map(el => {
            const clone = el.cloneNode(true);
            clone.classList.add('clone');
            return clone;
        });

        // Prepend in reverse order to keep correct sequence
        prependClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
        appendClones.forEach(clone => track.appendChild(clone));

        currentIndex = cardsPerSlide;
        updateTransform(false);
    };

    const getCardWidth = () => {
        const firstCard = track.children[0];
        return firstCard ? firstCard.offsetWidth : 0;
    };

    const updateTransform = (withTransition = true) => {
        const cardWidth = getCardWidth();
        const translateX = -(cardWidth * currentIndex);
        track.style.transition = withTransition ? 'transform 0.3s ease' : 'none';
        track.style.transform = `translateX(${translateX}px)`;
    };

    const moveTo = (direction) => {
        if (isTransitioning) return;
        isTransitioning = true;

        const cardWidth = getCardWidth();
        currentIndex += direction;
        updateTransform(true);

        setTimeout(() => {
            const totalItems = originalItems.length;

            if (currentIndex >= totalItems + cardsPerSlide) {
                currentIndex = cardsPerSlide;
                updateTransform(false);
            }

            if (currentIndex < cardsPerSlide) {
                currentIndex = totalItems + cardsPerSlide - 1;
                updateTransform(false);
            }

            isTransitioning = false;
        }, 310);
    };

    // Drag/Swipe Logic
    let startX = 0, currentX = 0, isDragging = false;

    const getX = e => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

    const startDrag = e => {
        isDragging = true;
        startX = getX(e);
        track.style.transition = 'none';
    };

    const onDrag = e => {
        if (!isDragging) return;
        currentX = getX(e);
        const delta = currentX - startX;
        const shift = -currentIndex * getCardWidth() + delta;
        track.style.transform = `translateX(${shift}px)`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        const delta = currentX - startX;
        const threshold = getCardWidth() / 4;

        if (delta < -threshold) {
            moveTo(1);
        } else if (delta > threshold) {
            moveTo(-1);
        } else {
            updateTransform(true);
        }
    };

    ['mousedown', 'touchstart'].forEach(evt =>
        track.addEventListener(evt, startDrag, { passive: true })
    );
    ['mousemove', 'touchmove'].forEach(evt =>
        track.addEventListener(evt, onDrag, { passive: true })
    );
    ['mouseup', 'mouseleave', 'touchend'].forEach(evt =>
        track.addEventListener(evt, endDrag)
    );

    const setup = () => {
        cardsPerSlide = getCardsPerSlide();
        cloneBufferItems();
    };

    window.addEventListener('resize', () => {
        setTimeout(setup, 100);
    });

    setup();
});



