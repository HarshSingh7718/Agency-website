(function () {
  "use strict";

  var section = document.querySelector(".rg-apart");
  if (!section) return;

  var dots = section.querySelectorAll(".rg-apart__dot");
  var steps = section.querySelectorAll(".rg-apart__step");
  if (!dots.length || !steps.length) return;

  function activate(index) {
    dots.forEach(function (d, i) {
      d.classList.toggle("is-active", i === index);
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
    steps.forEach(function (s, i) {
      s.classList.toggle("is-active", i === index);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      activate(i);
    });
  });

  steps.forEach(function (step, i) {
    step.addEventListener("mouseenter", function () {
      activate(i);
    });
    step.addEventListener("click", function () {
      activate(i);
    });
  });
})();
