// // device compat section tab navigation and active/hover effect with scroll pill
// document.addEventListener("DOMContentLoaded", () => {
//   const tabTrack = document.querySelector(".tab-track");
//   const buttons = tabTrack.querySelectorAll(".nav-link");
//   const pill = tabTrack.querySelector(".active-pill");
//   const PADDING = 48; // 24px left + 24px right

//   const setPillPosition = (button) => {
//     const buttonRect = button.getBoundingClientRect();
//     const trackRect = tabTrack.getBoundingClientRect();

//     const left = buttonRect.left - trackRect.left - 24;
//     const width = button.offsetWidth + PADDING;

//     pill.style.left = `${left}px`;
//     pill.style.width = `${width}px`;
//   };

//   const getActiveButton = () => tabTrack.querySelector(".nav-link.active");
//   if (getActiveButton()) setPillPosition(getActiveButton());

//   buttons.forEach(btn => {
//     btn.addEventListener("mouseenter", () => setPillPosition(btn));
//     btn.addEventListener("focus", () => setPillPosition(btn));
//     btn.addEventListener("click", () => {
//       setTimeout(() => {
//         const active = getActiveButton();
//         if (active) setPillPosition(active);
//       }, 10); // allow Bootstrap to apply active class
//     });
//   });

//   tabTrack.addEventListener("mouseleave", () => {
//     const active = getActiveButton();
//     if (active) setPillPosition(active);
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const tabTrack = document.querySelector(".tab-track");
  const buttons = tabTrack.querySelectorAll(".nav-link");
  const pill = tabTrack.querySelector(".active-pill");

  const getPadding = () => {
    // Return total horizontal padding based on screen width
    return window.innerWidth > 576 ? 48 : 32; // 16px each side for >576px, else 24px each
  };

  const getOffset = () => {
    // Return left-side padding based on screen width
    return window.innerWidth > 576 ? 24 : 16;
  };

  const setPillPosition = (button) => {
    const buttonRect = button.getBoundingClientRect();
    const trackRect = tabTrack.getBoundingClientRect();

    const left = buttonRect.left - trackRect.left - getOffset();
    const width = button.offsetWidth + getPadding();

    pill.style.left = `${left}px`;
    pill.style.width = `${width}px`;
  };

  const getActiveButton = () => tabTrack.querySelector(".nav-link.active");
  if (getActiveButton()) setPillPosition(getActiveButton());

  buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => setPillPosition(btn));
    btn.addEventListener("focus", () => setPillPosition(btn));
    btn.addEventListener("click", () => {
      setTimeout(() => {
        const active = getActiveButton();
        if (active) setPillPosition(active);
      }, 10); // Bootstrap delay for applying 'active' class
    });
  });

  tabTrack.addEventListener("mouseleave", () => {
    const active = getActiveButton();
    if (active) setPillPosition(active);
  });

  // Recalculate position on window resize to maintain visual consistency
  window.addEventListener("resize", () => {
    const active = getActiveButton();
    if (active) setPillPosition(active);
  });
});


// device compat section set most bigger height of tab pane to tab content for prevent from layout shifting
document.addEventListener("DOMContentLoaded", function () {
  const tabContent = document.getElementById("deviceTabContent");

  function setMaxHeight() {
    let maxHeight = 0;
    const panes = tabContent.querySelectorAll(".tab-pane");

    panes.forEach(pane => {
      // Temporarily show hidden pane to measure its height
      const wasHidden = !pane.classList.contains("show");
      if (wasHidden) {
        pane.classList.add("show", "active");
      }

      const height = pane.scrollHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }

      // Restore previous hidden state
      if (wasHidden) {
        pane.classList.remove("show", "active");
      }
    });

    tabContent.style.minHeight = maxHeight + "px";
  }

  // Run on load
  setMaxHeight();

  // Run on window resize
  window.addEventListener("resize", setMaxHeight);
});

// enable tabs scroll when tabs overflow from parent
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.getElementById("device-compat-tab-wrapper");
  const track = document.getElementById("device-compat-tab-track");

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let dragged = false;
  let userScrolled = false;

  function startDrag(e) {
    isDragging = true;
    dragged = false;
    startX = e.pageX || e.touches[0].pageX;
    scrollLeft = wrapper.scrollLeft;
    wrapper.style.cursor = "grabbing";
  }

  function onDrag(e) {
    if (!isDragging) return;
    const x = e.pageX || e.touches[0].pageX;
    const walk = x - startX;
    if (Math.abs(walk) > 5) dragged = true;
    wrapper.scrollLeft = scrollLeft - walk;
    userScrolled = true;
  }

  function stopDrag() {
    isDragging = false;
    wrapper.style.cursor = "default";
  }

  // Prevent accidental tab switch during drag
  track.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", function (e) {
      if (dragged) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
  });

  // Scroll the active tab button into view
  function scrollToActiveTab() {
    if (userScrolled) return; // Don't auto-scroll if user manually scrolled

    const activeBtn = track.querySelector("button.active");
    if (!activeBtn) return;

    const btnLeft = activeBtn.offsetLeft;
    const btnRight = btnLeft + activeBtn.offsetWidth;
    const wrapperLeft = wrapper.scrollLeft;
    const wrapperRight = wrapperLeft + wrapper.offsetWidth;

    if (btnLeft < wrapperLeft || btnRight > wrapperRight) {
      // Option 1: Center the button
      const offset = btnLeft + activeBtn.offsetWidth / 2 - wrapper.offsetWidth / 2;
      wrapper.scrollTo({ left: offset, behavior: 'smooth' });

      // Option 2: Use `scrollIntoView` (alternative)
      // activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  // Initial and resize adjustment
  window.addEventListener("load", scrollToActiveTab);
  window.addEventListener("resize", () => {
    userScrolled = false;
    scrollToActiveTab();
  });

  // Event listeners
  track.addEventListener("mousedown", startDrag);
  track.addEventListener("touchstart", startDrag, { passive: true });

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDrag, { passive: false });

  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);

  // Ensure hovered tab is fully visible inside wrapper
  track.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('mouseenter', () => {
      const tabLeft = tab.offsetLeft;
      const tabRight = tabLeft + tab.offsetWidth;
      const wrapperLeft = wrapper.scrollLeft;
      const wrapperRight = wrapperLeft + wrapper.offsetWidth;

      // Scroll only if the tab is partially out of view
      if (tabLeft < wrapperLeft || tabRight > wrapperRight) {
        wrapper.scrollTo({
          left: tabLeft - 16, // Add some padding
          behavior: 'smooth'
        });
      }
    });
  });

});
