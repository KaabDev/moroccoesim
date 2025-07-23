// Function for line below navitems for hover and active

// document.addEventListener("DOMContentLoaded", function () {
//   const navItems = document.querySelectorAll("#main-nav .nav-item");
//   const underline = document.querySelector("#main-nav .underline");
//   const navContainer = document.querySelector("#main-nav");

//   let activeItem = document.querySelector("#main-nav .nav-item .nav-link.active")?.parentElement;

//   function updateUnderline(el) {
//     const containerRect = navContainer.getBoundingClientRect();
//     const itemRect = el.getBoundingClientRect();
//     const itemCenter = itemRect.left + itemRect.width / 2;
//     const containerLeft = containerRect.left;

//     const underlineLeft = itemCenter - containerLeft - 15; // 15 = half of 30px underline

//     underline.style.transform = `translateX(${underlineLeft}px)`;
//   }

//   // Handle click - update active state and underline
//   navItems.forEach(item => {
//     item.addEventListener("click", () => {
//       document.querySelector("#main-nav .nav-link.active")?.classList.remove("active");
//       item.querySelector(".nav-link").classList.add("active");
//       activeItem = item;
//       updateUnderline(activeItem);
//     });

//     // Hover in - move underline
//     item.addEventListener("mouseenter", () => {
//       updateUnderline(item);
//     });

//     // Hover out - return to active
//     item.addEventListener("mouseleave", () => {
//       if (activeItem) updateUnderline(activeItem);
//     });
//   });

//   // Init on page load
//   window.addEventListener("load", () => {
//     if (activeItem) updateUnderline(activeItem);
//   });

//   // Update on resize
//   window.addEventListener("resize", () => {
//     if (activeItem) updateUnderline(activeItem);
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll("#main-nav .nav-item");
    const activeLine = document.querySelector("#main-nav .active-line");
    const hoverLine = document.querySelector("#main-nav .hover-line");
    const navContainer = document.querySelector("#main-nav");

    let activeItem = document.querySelector("#main-nav .nav-item .nav-link.active")?.parentElement;
    let hoverTimeout;
    const HOVER_FADE_DURATION = 200; // milliseconds

    function getCenteredLeft(el) {
        const containerRect = navContainer.getBoundingClientRect();
        const itemRect = el.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const containerLeft = containerRect.left;
        return itemCenter - containerLeft - 15; // 15 = half of 30px
    }

    function positionLine(line, targetEl) {
        const x = getCenteredLeft(targetEl);
        line.style.left = `${x}px`;
    }

    function setActive(item) {
        positionLine(activeLine, item);
        activeLine.style.opacity = "1";
    }

    window.addEventListener("load", () => {
        if (activeItem) {
            setActive(activeItem);
        }
    });

    window.addEventListener("resize", () => {
        if (activeItem) {
            setActive(activeItem);
        }
    });

    navItems.forEach(item => {
        const link = item.querySelector(".nav-link");

        // Set active on click
        item.addEventListener("click", () => {
            document.querySelector("#main-nav .nav-link.active")?.classList.remove("active");
            link.classList.add("active");
            activeItem = item;
            setActive(activeItem);
        });

        // Hover enter
        item.addEventListener("mouseenter", () => {
            clearTimeout(hoverTimeout);
            hoverLine.style.opacity = "0";

            hoverTimeout = setTimeout(() => {
                positionLine(hoverLine, item);
                hoverLine.style.opacity = "1";
            }, HOVER_FADE_DURATION);
        });

        // Hover leave
        item.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimeout);
            hoverLine.style.opacity = "0";
        });
    });
});

// talk about section swap slider card highlight at center and Recenter After Hover Ends
const updateActiveCard = () => {
    const wrapper = document.querySelector('.talk-about-section .swap-slider-wrapper');
    const track = wrapper.querySelector('.swap-slider-track');
    const cards = Array.from(track.querySelectorAll('.bg-white'));

    const wrapperRect = wrapper.getBoundingClientRect();
    const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;

        const distance = Math.abs(wrapperCenterX - cardCenterX);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestCard = card;
        }
    });

    cards.forEach(card => card.classList.remove('card-active'));

    if (closestCard) {
        closestCard.classList.add('card-active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.talk-about-section .swap-slider-wrapper');
    const track = wrapper.querySelector('.swap-slider-track');

    // Run once on load
    updateActiveCard();

    // Recalculate on resize or scroll
    window.addEventListener('resize', updateActiveCard);
    track.addEventListener('scroll', updateActiveCard);

    // Remove active on hover
    wrapper.addEventListener('mouseenter', () => {
        const cards = wrapper.querySelectorAll('.bg-white');
        cards.forEach(card => card.classList.remove('card-active'));
    });

    // Reapply on mouse leave
    wrapper.addEventListener('mouseleave', () => {
        updateActiveCard();
    });
});

// faq section accordion collapse and expend class changing on toggler
document.querySelectorAll('.faq-item').forEach(faqItem => {
    faqItem.addEventListener('click', (event) => {
        const isHeader = event.target.closest('.question-header');
        const isExpanded = faqItem.classList.contains('expended');

        // If clicked on header and it's already expanded → collapse it
        if (isHeader && isExpanded) {
            faqItem.classList.remove('expended');
            return;
        }

        // Otherwise → expand it and collapse others
        document.querySelectorAll('.faq-item.expended').forEach(item => {
            if (item !== faqItem) item.classList.remove('expended');
        });

        faqItem.classList.add('expended');
    });
});

