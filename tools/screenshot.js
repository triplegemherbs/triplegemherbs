const fs = require('fs');
const path = require('path');
const playwright = require('playwright');

(async () => {
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const base = 'http://localhost:8000';
  const pages = [
    { name: 'home', url: '/index.html' },
    { name: 'zine', url: '/zine.html' },
    { name: 'events', url: '/events.html' },
    { name: 'publications', url: '/publications.html' },
    { name: 'blog', url: '/blog.html' },
    { name: 'newsletter', url: '/newsletter.html' },
  ];

  const widths = [375, 768, 1024, 1440];

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const p of pages) {
    const target = base + p.url;
    for (const w of widths) {
      const h = 900; // initial height; we'll use fullPage screenshot
      await page.setViewportSize({ width: w, height: h });
      try {
        await page.goto(target, { waitUntil: 'networkidle' , timeout: 15000});
      } catch (err) {
        console.error(`Failed to load ${target}:`, err.message);
      }
      const fileName = `${p.name}-${w}.png`;
      const outPath = path.join(outDir, fileName);
      try {
        await page.screenshot({ path: outPath, fullPage: true });
        console.log('Saved', outPath);
      } catch (err) {
        console.error('Screenshot failed for', target, 'at', w, err.message);
      }
    }
  }

  await browser.close();
  console.log('Screenshots complete.');
})();
