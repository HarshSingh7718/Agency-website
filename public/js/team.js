

(function () {
  "use strict";

  var doc = document;

  function ready(fn) {
    if (doc.readyState !== "loading") fn();
    else doc.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var slider = doc.getElementById("teamSlider");
    var btnPrev = doc.getElementById("teamPrev");
    var btnNext = doc.getElementById("teamNext");

    if (!slider || !btnPrev || !btnNext) return;

    // Scroll function
    function scrollSlider(direction) {
      var cards = slider.querySelectorAll(".team-card");
      if (!cards.length) return;

      var firstCard = cards[0];
      var cardWidth = firstCard.offsetWidth;
      var style = window.getComputedStyle(slider);
      var gap = parseInt(style.columnGap || style.gap || "24", 10) || 24;

      var scrollAmount = cardWidth + gap;

      if (direction === "next") {
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }

    // Toggle button state based on scroll position
    function updateButtonStates() {
      var scrollLeft = slider.scrollLeft;
      var scrollWidth = slider.scrollWidth;
      var clientWidth = slider.clientWidth;

      // Disable/enable Prev Button
      if (scrollLeft <= 2) {
        btnPrev.classList.add("disabled");
        btnPrev.setAttribute("aria-disabled", "true");
      } else {
        btnPrev.classList.remove("disabled");
        btnPrev.removeAttribute("aria-disabled");
      }

      // Disable/enable Next Button
      // Note: use -5 tolerance to account for decimal scaling/pixel rounding
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        btnNext.classList.add("disabled");
        btnNext.setAttribute("aria-disabled", "true");
      } else {
        btnNext.classList.remove("disabled");
        btnNext.removeAttribute("aria-disabled");
      }
    }

    // Event Listeners
    btnPrev.addEventListener("click", function () {
      scrollSlider("prev");
    });

    btnNext.addEventListener("click", function () {
      scrollSlider("next");
    });

    // Update button states on scroll and window resize
    slider.addEventListener("scroll", updateButtonStates, { passive: true });
    window.addEventListener("resize", updateButtonStates, { passive: true });

    // Initial state check
    // Wait a tiny bit for rendering/sizing calculations
    setTimeout(updateButtonStates, 100);
  });
})();
