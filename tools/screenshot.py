import asyncio
from pathlib import Path
from playwright.async_api import async_playwright


async def run():
    out_dir = Path(__file__).resolve().parent.parent / 'screenshots'
    out_dir.mkdir(parents=True, exist_ok=True)

    base = 'http://localhost:8000'
    pages = [
        ('home', '/index.html'),
        ('zine', '/zine.html'),
        ('events', '/events.html'),
        ('publications', '/publications.html'),
        ('blog', '/blog.html'),
        ('newsletter', '/newsletter.html'),
    ]
    widths = [375, 768, 1024, 1440]

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        for name, url in pages:
            target = base + url
            for w in widths:
                h = 900
                await page.set_viewport_size({'width': w, 'height': h})
                try:
                    await page.goto(target, wait_until='networkidle', timeout=15000)
                except Exception as e:
                    print(f'Failed to load {target}: {e}')
                out_path = out_dir / f"{name}-{w}.png"
                try:
                    await page.screenshot(path=str(out_path), full_page=True)
                    print('Saved', out_path)
                except Exception as e:
                    print('Screenshot failed for', target, 'at', w, e)

        await browser.close()
    print('Screenshots complete.')


if __name__ == '__main__':
    asyncio.run(run())
