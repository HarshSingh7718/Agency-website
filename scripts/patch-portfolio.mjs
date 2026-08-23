import fs from "fs";

const projects = [
  {
    name: "Big Fat Marketing",
    tag: "Marketing Agency",
    href: "https://bigfatmarketing.in",
    img: "https://gap3.studio/wp-content/uploads/2026/07/big-fat-marketing-agency-website-design-1.png",
  },
  {
    name: "Blue In Berry",
    tag: "Food & Hospitality",
    href: "https://blueinberry.com",
    img: "https://gap3.studio/wp-content/uploads/2026/07/blue-in-berry-ice-cream-website-design.png",
  },
  {
    name: "Lumitec Consulting",
    tag: "Corporate Consulting",
    href: "#",
    img: "https://gap3.studio/wp-content/uploads/2026/07/lumitec-consulting-website-design.png",
  },
  {
    name: "Derma Energy",
    tag: "Ecommerce",
    href: "#",
    img: "https://gap3.studio/wp-content/uploads/2026/07/derma-energy-skincare-ecommerce-website-design.png",
  },
  {
    name: "One Bill",
    tag: "Fintech App",
    href: "#",
    img: "https://gap3.studio/wp-content/uploads/2026/07/one-bill.webp",
  },
  {
    name: "Faceluxe",
    tag: "Beauty & Retail",
    href: "#",
    img: "https://gap3.studio/wp-content/uploads/2026/07/faceluxe.webp",
  },
  {
    name: "BuddyGo",
    tag: "Mobile App",
    href: "#",
    img: "https://gap3.studio/wp-content/uploads/2026/07/buddygo.webp",
  },
  {
    name: "Uni Web Apps",
    tag: "SaaS Platform",
    href: "#",
    img: "https://gap3.studio/wp-content/uploads/2026/07/uni-web-apps.webp",
  },
];

const cards = projects
  .map(
    (p) => `
      <a class="rg-portfolio__card reveal${p.href !== "#" ? " is-ext" : ""}" href="${p.href}"${p.href !== "#" ? ' target="_blank" rel="noopener"' : ""} aria-label="${p.name} — ${p.tag}">
        <div class="rg-portfolio__scene">
          <img src="${p.img}" alt="${p.name} project preview" loading="lazy" decoding="async" />
        </div>
        <span class="rg-portfolio__brand">${p.name}</span>
        <div class="rg-portfolio__hover">
          <span class="rg-portfolio__icon" aria-hidden="true">↗</span>
          <h3>${p.name}</h3>
          <span class="rg-portfolio__tag">${p.tag}</span>
        </div>
      </a>`
  )
  .join("\n");

const section = `<section class="rg-portfolio" id="work" aria-labelledby="work-h">
  <div class="container">
    <div class="rg-portfolio__head reveal">
      <h2 id="work-h">Our success stories showcasing <span class="accent">innovation in action</span></h2>
      <p>Explore high-impact web, ecommerce, and SaaS solutions we've delivered for brands across industries.</p>
    </div>
    <div class="rg-portfolio__grid">
${cards}
    </div>
    <div class="rg-portfolio__foot reveal">
      <a class="btn dark" href="#" data-magnetic>View all projects <span class="arrow">&#8599;</span></a>
    </div>
  </div>
</section>`;

let html = fs.readFileSync("index.html", "utf8");
const start = html.indexOf('<section  class="work-dark"');
const end = html.indexOf("</section>", start) + "</section>".length;

if (start === -1) {
  console.error("work-dark section not found");
  process.exit(1);
}

html = html.slice(0, start) + section + html.slice(end);

if (!html.includes("portfolio-showcase.css")) {
  html = html.replace(
    '<link rel="stylesheet" href="/css/sections-v2.css" />',
    '<link rel="stylesheet" href="/css/sections-v2.css" />\n  <link rel="stylesheet" href="/css/portfolio-showcase.css" />'
  );
}

fs.writeFileSync("index.html", html);
console.log("Portfolio section updated with", projects.length, "cards");
