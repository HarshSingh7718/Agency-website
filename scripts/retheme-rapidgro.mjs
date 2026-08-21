import fs from "fs";
import path from "path";

const root = process.cwd();

// --- Theme tokens: green → RapidGro purple/magenta ---
const themePath = path.join(root, "public/css/theme.css");
let theme = fs.readFileSync(themePath, "utf8");

theme = theme.replace(
  /\/\* light neutrals \*\/[\s\S]*?--c-line-2:[^;]+;/,
  `/* light neutrals — lavender paper */
  --c-bg: #F8F6FB;            /* paper */
  --c-white: #FFFFFF;
  --c-band: #F0E6F8;          /* soft violet tint */
  --c-bg-alt: #F0E6F8;
  --c-ctaband: #F0E6F8;
  --c-icon-bg: #EAD9F5;       /* icon chips */
  --c-mint: #E0CCF0;          /* ribbon strip */
  --c-mint-border: #D2B6E8;
  --c-ctaband-border: #DEC8EC;
  --c-line: #E6E0EE;          /* hairline */
  --c-line-2: #EDE6F4;`
);

theme = theme.replace(
  /\/\* green \(from logo\) \*\/[\s\S]*?--c-green-on-dark:[^;]+;/,
  `/* purple / magenta (from RapidGroDigital logo) */
  --c-green: #E91E8C;         /* brand MAGENTA — dots, marks, focus, fills */
  --c-green-deep: #3D1578;    /* deep purple — primary buttons, dark cards */
  --c-green-link: #7B1FA2;    /* medium purple — links + serif accent */
  --c-green-on-dark: #FF4DB8; /* bright magenta on dark surfaces */`
);

theme = theme.replace(
  /\/\* ink \/ text \(near-black green from logo\) \*\/[\s\S]*?--c-dark:[^;]+;/,
  `/* ink / text (near-black purple) */
  --c-ink: #1A0B2E;           /* headings, dark sections, footer */
  --c-ink-soft: #2A1640;
  --c-body: #3D3550;          /* body text */
  --c-secondary: #4A4260;
  --c-muted: #6B6480;         /* meta / micro labels */
  --c-dark: #140820;          /* dark sections */`
);

theme = theme.replace(
  /\/\* text on dark \*\/[\s\S]*?--c-line-dark:[^;]+;/,
  `/* text on dark */
  --c-on-dark: #F7F2FC;
  --c-on-dark-2: #D4C6E8;
  --c-on-dark-3: #E2D6F0;
  --c-on-dark-muted: #A090B8;
  --c-line-dark: rgba(247, 242, 252, 0.12);`
);

theme = theme.replace(
  /\/\* stars \(kept on-palette green, not gold\) \*\/\s*--c-star:[^;]+;/,
  `/* stars */
  --c-star: #7B1FA2;`
);

// Hardcoded green rgba → purple/magenta
theme = theme
  .replaceAll("rgba(126, 231, 167, 0.14)", "rgba(233, 30, 140, 0.14)")
  .replaceAll("rgba(126,231,167,0.16)", "rgba(233,30,140,0.16)")
  .replaceAll("rgba(126,231,167,0.18)", "rgba(233,30,140,0.18)")
  .replaceAll("rgba(126,231,167,0.12)", "rgba(233,30,140,0.12)")
  .replaceAll("rgba(70,226,53,0.11)", "rgba(233,30,140,0.12)")
  .replaceAll("rgba(26,208,11,0.15)", "rgba(123,31,162,0.16)")
  .replaceAll("rgba(70, 226, 53, .1)", "rgba(233, 30, 140, .12)")
  .replaceAll("rgba(70, 226, 53, .12)", "rgba(233, 30, 140, .14)")
  .replaceAll("rgba(70, 226, 53, .55)", "rgba(233, 30, 140, .55)");

// Logo sizing for stacked RapidGro mark + wordmark
theme = theme.replace(
  `.brand-logo { display: block; width: auto; max-width: 120px; }
.footer-brand .brand-logo { max-width: 180px; }`,
  `.brand-logo { display: block; width: auto; height: 52px; max-width: 200px; object-fit: contain; }
.footer-brand .brand-logo { height: 64px; max-width: 240px; }
.m-brand .brand-logo { height: 56px; max-width: 220px; }`
);

fs.writeFileSync(themePath, theme);

// sections-v2 hardcoded greens
const secPath = path.join(root, "public/css/sections-v2.css");
let sec = fs.readFileSync(secPath, "utf8");
sec = sec.replaceAll("rgba(126,231,167,0.16)", "rgba(233,30,140,0.16)");
fs.writeFileSync(secPath, sec);

// Hero smoke shader colors
const smokePath = path.join(root, "public/js/hero-smoke.js");
let smoke = fs.readFileSync(smokePath, "utf8");
smoke = smoke
  .replace(
    'vec3 lime = vec3(0.102,0.816,0.043);',
    'vec3 lime = vec3(0.913,0.118,0.549);' // magenta #E91E8C
  )
  .replace(
    'vec3 mid  = vec3(0.275,0.886,0.208);',
    'vec3 mid  = vec3(0.482,0.122,0.635);' // purple #7B1FA2
  );
fs.writeFileSync(smokePath, smoke);

// HTML branding
const indexPath = path.join(root, "index.html");
let html = fs.readFileSync(indexPath, "utf8");

html = html
  .replace(
    /<title>.*?<\/title>/,
    "<title>Full Service Digital Marketing Agency | RapidGroDigital</title>"
  )
  .replace(
    /content="GAP3 is a full service[^"]*"/,
    'content="RapidGroDigital is a full service digital marketing agency. Websites, ecommerce and SEO built for traffic and leads."'
  )
  .replace('content="#ecffeb"', 'content="#F8F6FB"')
  .replaceAll('href="/images/Agency-logo.jpeg"', 'href="/images/rapidgro-logo.png"')
  .replaceAll('type="image/svg+xml" href="/images/rapidgro-logo.png"', 'type="image/png" href="/images/rapidgro-logo.png"')
  .replaceAll("/images/logo.svg", "/images/Agency-logo-bg-removed.png")
  .replaceAll("/images/rapidgro-logo.png", "/images/Agency-logo-bg-removed.png")
  .replaceAll('href="/images/Agency-logo.jpeg"', 'href="/images/Agency-logo-bg-removed.png"')
  .replaceAll("GAP3 Digital Marketing home", "RapidGroDigital home")
  .replaceAll("GAP3 Digital Marketing logo", "RapidGroDigital logo")
  .replaceAll("GAP3 digital marketing agency", "RapidGroDigital")
  .replaceAll("project by GAP3", "project by RapidGroDigital")
  .replaceAll("working with the GAP3 team", "working with the RapidGroDigital team")
  .replaceAll("&copy; 2026 GAP3.", "&copy; 2026 RapidGroDigital.")
  .replaceAll("connect@gap3.studio", "connect@rapidgrodigital.com")
  .replaceAll("mailto:connect@rapidgrodigital.com", "mailto:connect@rapidgrodigital.com");

fs.writeFileSync(indexPath, html);

console.log("Theme + branding updated for RapidGroDigital");
