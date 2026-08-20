import fs from "fs";

const html = fs.readFileSync("gap3-source.html", "utf8");
const start = html.indexOf('<header class="site-header">');
const end = html.indexOf("</footer>") + "</footer>".length;
let body = html.slice(start, end);

// Keep media assets on the live CDN
body = body.replaceAll("https://gap3.studio/", "___ORIGIN___/");
body = body.replace(/___ORIGIN___\/(?!wp-content)/g, "/");
body = body.replaceAll("___ORIGIN___/", "https://gap3.studio/");

// Point internal nav/page links to hash anchors for the single-page
body = body.replace(/href="\/([^"#?]*)"/g, (match, path) => {
  if (path.startsWith("wp-content")) return match;
  if (!path || path === "") return 'href="/"';
  return 'href="#"';
});

fs.writeFileSync("assets-src/body-fragment.html", body);
console.log("Wrote body-fragment.html", body.length);
