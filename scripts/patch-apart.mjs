import fs from "fs";

const section = `<section class="rg-apart" id="approach" aria-labelledby="apart-h">
  <div class="container">
    <div class="rg-apart__top reveal">
      <span class="rg-apart__label">What sets us apart</span>
      <span class="rg-apart__count" aria-hidden="true">04 <span>Steps</span></span>
    </div>
    <h2 class="rg-apart__title reveal" id="apart-h">
      What truly sets us
      <span class="accent">apart from the rest.</span>
    </h2>
    <div class="rg-apart__track reveal" role="tablist" aria-label="Our process steps">
      <div class="rg-apart__line" aria-hidden="true"></div>
      <div class="rg-apart__dots">
        <button type="button" class="rg-apart__dot is-active" role="tab" aria-selected="true" aria-controls="apart-step-1" id="apart-tab-1" data-step="0">1</button>
        <button type="button" class="rg-apart__dot" role="tab" aria-selected="false" aria-controls="apart-step-2" id="apart-tab-2" data-step="1">2</button>
        <button type="button" class="rg-apart__dot" role="tab" aria-selected="false" aria-controls="apart-step-3" id="apart-tab-3" data-step="2">3</button>
        <button type="button" class="rg-apart__dot" role="tab" aria-selected="false" aria-controls="apart-step-4" id="apart-tab-4" data-step="3">4</button>
      </div>
    </div>
    <div class="rg-apart__grid reveal">
      <article class="rg-apart__step is-active" id="apart-step-1" role="tabpanel" aria-labelledby="apart-tab-1">
        <h3><em>01.</em> Search-first thinking</h3>
        <p>Every build starts with how it will be found. We plan structure, speed, and content for search visibility from day one.</p>
      </article>
      <article class="rg-apart__step" id="apart-step-2" role="tabpanel" aria-labelledby="apart-tab-2">
        <h3><em>02.</em> Fast &amp; effective delivery</h3>
        <p>Weekly demos and a fixed, itemized quote. You see progress every week and never meet a surprise invoice.</p>
      </article>
      <article class="rg-apart__step" id="apart-step-3" role="tabpanel" aria-labelledby="apart-tab-3">
        <h3><em>03.</em> One holistic team</h3>
        <p>Design, development, SEO, and automation under one roof—no handoff friction between agencies.</p>
      </article>
      <article class="rg-apart__step" id="apart-step-4" role="tabpanel" aria-labelledby="apart-tab-4">
        <h3><em>04.</em> Fair &amp; flexible pricing</h3>
        <p>Budget-friendly work scoped to fit, from a single landing page to a full digital marketing system.</p>
      </article>
    </div>
  </div>
</section>`;

let html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf('<section  class="apart tint">');
if (start === -1) {
  const alt = html.indexOf('<section class="apart tint">');
  if (alt === -1) {
    console.error("apart section not found");
    process.exit(1);
  }
}
const end = html.indexOf("</section>", start) + "</section>".length;
html = html.slice(0, start) + section + html.slice(end);

if (!html.includes("apart-steps.css")) {
  html = html.replace(
    '<link rel="stylesheet" href="/css/portfolio-showcase.css" />',
    '<link rel="stylesheet" href="/css/portfolio-showcase.css" />\n  <link rel="stylesheet" href="/css/apart-steps.css" />'
  );
  if (!html.includes("apart-steps.css")) {
    html = html.replace(
      '<link rel="stylesheet" href="/css/sections-v2.css" />',
      '<link rel="stylesheet" href="/css/sections-v2.css" />\n  <link rel="stylesheet" href="/css/apart-steps.css" />'
    );
  }
}

if (!html.includes("apart-steps.js")) {
  html = html.replace(
    '<script src="/js/custom.js"></script>',
    '<script src="/js/apart-steps.js"></script>\n<script src="/js/custom.js"></script>'
  );
}

fs.writeFileSync("index.html", html);
console.log("Apart section restructured");
