import fs from "fs";

let body = fs.readFileSync("assets-src/body-fragment.html", "utf8")
  .replaceAll(
    "https://gap3.studio/wp-content/uploads/2026/07/logo.svg",
    "/images/logo.svg"
  );

// In-page section jumps for the single-page home
body = body
  .replace('<a href="#" class="">Work</a>', '<a href="#work" class="">Work</a>')
  .replace('<a href="#" class="">Blog</a>', '<a href="#journal" class="">Blog</a>')
  .replace('<a href="#"><span class="i">04</span>Work</a>', '<a href="#work"><span class="i">04</span>Work</a>')
  .replace('<a href="#"><span class="i">05</span>Blog</a>', '<a href="#journal"><span class="i">05</span>Blog</a>');

const index = `<!DOCTYPE html>
<html lang="en-US" class="no-js">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Full Service Digital Marketing Agency | GAP3</title>
  <meta name="description" content="GAP3 is a full service digital marketing agency in India working with brands across the USA and UK. Websites, ecommerce and SEO built for traffic and leads." />
  <meta name="theme-color" content="#ecffeb" />
  <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
  <script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Great+Vibes&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/theme.css" />
  <link rel="stylesheet" href="/css/responsive.css" />
  <link rel="stylesheet" href="/css/sections-v2.css" />
  <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
</head>
<body class="home">
<a class="skip-link" href="#main">Skip to content</a>
${body}
<button class="back-to-top" aria-label="Back to top"><iconify-icon icon="lucide:arrow-up"></iconify-icon></button>
<script src="/js/hero-smoke.js"></script>
<script src="/js/custom.js"></script>
</body>
</html>
`;

fs.writeFileSync("index.html", index);
console.log("Wrote index.html", index.length);
