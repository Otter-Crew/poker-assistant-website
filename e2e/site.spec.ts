import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { conceptLessons, productLessons, routes } from './routes';

const IMAGE_BUDGET_BYTES = { desktop: 900_000, mobile: 700_000 } as const;

for (const route of routes) {
  test.describe(route.path, () => {
    test('renders with its title, one h1, and the chrome', async ({ page }) => {
      await page.goto(route.path);
      await expect(page).toHaveTitle(route.title);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('main h1')).toHaveText(route.heading);
      await expect(page.locator('footer')).toContainText(
        'A study tool. Not for use during play.',
      );
      await expect(
        page.locator('header nav[aria-label="Primary"] a'),
      ).toHaveText(['How it works', 'Solutions', 'Learn']);
      await expect(
        page.locator('footer nav[aria-label="Footer"] a'),
      ).toHaveText(['Learn', 'Solutions', 'Accuracy', 'FAQ', 'Privacy']);
    });

    test('every image has alt, width and height; one high-priority image at most', async ({
      page,
    }) => {
      await page.goto(route.path);
      const images = page.locator('main img');
      const count = await images.count();
      for (let i = 0; i < count; i += 1) {
        const image = images.nth(i);
        await expect(image).toHaveAttribute('alt', /\S/u);
        await expect(image).toHaveAttribute('width', /^\d+$/u);
        await expect(image).toHaveAttribute('height', /^\d+$/u);
      }
      expect(
        await page.locator('img[fetchpriority="high"]').count(),
      ).toBeLessThanOrEqual(1);
      if (count > 0) {
        await expect(page.locator('main img').first()).toHaveAttribute(
          'loading',
          /eager|lazy/u,
        );
      }
    });

    test('has no horizontal overflow', async ({ page }) => {
      await page.goto(route.path);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    });

    test('stays inside the image weight budget', async ({ page }, testInfo) => {
      const sizes: Promise<number>[] = [];
      page.on('response', (response) => {
        if (response.request().resourceType() === 'image') {
          sizes.push(
            response
              .body()
              .then((body) => body.byteLength)
              .catch(() => 0),
          );
        }
      });
      await page.goto(route.path);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState('networkidle');
      const bytes = (await Promise.all(sizes)).reduce((sum, n) => sum + n, 0);
      const budget =
        IMAGE_BUDGET_BYTES[
          testInfo.project.name as keyof typeof IMAGE_BUDGET_BYTES
        ];
      expect(bytes).toBeLessThanOrEqual(budget);
    });

    test('matches the reviewed capture', async ({ page }, testInfo) => {
      await page.goto(route.path);
      const name = `${route.path === '/' ? 'home' : route.path.slice(1).replaceAll('/', '-')}-${testInfo.project.name}.png`;
      await expect(page).toHaveScreenshot(name, { fullPage: true });
    });
  });
}

test.describe('site-wide', () => {
  test('every internal link in the build resolves', async ({ request }) => {
    const dist = path.resolve('dist');
    const pages = walk(dist).filter((file) => file.endsWith('.html'));
    const hrefs = new Set<string>();
    for (const file of pages) {
      const html = readFileSync(file, 'utf8');
      for (const match of html.matchAll(/href="(\/[^"#?]*)/gu)) {
        hrefs.add(match[1] ?? '');
      }
    }
    expect(hrefs.size).toBeGreaterThan(20);
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
    }
  });

  test('every heading anchor on every lesson is reachable', async ({
    page,
  }) => {
    for (const route of routes.filter((r) => r.path.startsWith('/learn/'))) {
      await page.goto(route.path);
      const anchors = page.locator('nav[aria-label="On this page"] a');
      const count = await anchors.count();
      expect(count, route.path).toBeGreaterThan(2);
      for (let i = 0; i < count; i += 1) {
        const href = (await anchors.nth(i).getAttribute('href')) ?? '';
        expect(href).toMatch(/^#/u);
        await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
      }
    }
  });

  test('/learn lists both collections in order and hides drafts', async ({
    page,
  }) => {
    await page.goto('/learn');
    await expect(
      page
        .locator('main h2')
        .filter({ hasText: /^(Use Poker Assistant|Poker concepts)$/u }),
    ).toHaveCount(2);
    const lists = page.locator('main ol[role="list"]');
    await expect(lists.nth(0).locator('h2')).toHaveText(productLessons);
    await expect(lists.nth(1).locator('h2')).toHaveText(conceptLessons);
    await expect(page.locator('main')).not.toContainText('Draft fixture');
    const draft = await page.request.get('/learn/draft-fixture');
    expect(draft.status()).toBe(404);
  });

  test('StoryBeat renders both heading levels', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main ol[role="list"] h3').first()).toBeVisible();
    await page.goto('/learn');
    await expect(page.locator('main ol[role="list"] h2').first()).toBeVisible();
  });

  test('a lesson has no trailing hand-written next link and one Try next', async ({
    page,
  }) => {
    await page.goto('/learn/start-here');
    await expect(page.locator('main').getByText(/^Next:/u)).toHaveCount(0);
    await expect(
      page.locator('main a', { hasText: /^Try next:/u }),
    ).toHaveCount(1);
  });

  test('social meta is emitted on every route when a site url is set', async () => {
    const dist = path.resolve('dist');
    const built = readFileSync(path.join(dist, 'index.html'), 'utf8');
    test.skip(
      !built.includes('rel="canonical"'),
      'PUBLIC_SITE_URL was not set for this build',
    );
    for (const route of routes) {
      const file =
        route.path === '/'
          ? 'index.html'
          : path.join(route.path.slice(1), 'index.html');
      const html = readFileSync(path.join(dist, file), 'utf8');
      expect(html, route.path).toMatch(
        /property="og:image" content="[^"]+\/og\.png"/u,
      );
      expect(html, route.path).toContain(
        'property="og:image:width" content="1200"',
      );
      expect(html, route.path).toContain(
        'property="og:image:height" content="630"',
      );
      expect(html, route.path).toMatch(
        /property="og:image:alt" content="[^"]+"/u,
      );
    }
  });

  test('sitemap lists every route when a site url is set', async () => {
    const file = path.resolve('dist/sitemap-0.xml');
    test.skip(!existsSync(file), 'PUBLIC_SITE_URL was not set for this build');
    const xml = readFileSync(file, 'utf8');
    for (const route of routes) {
      expect(xml, route.path).toContain(
        `${route.path === '/' ? '/' : `${route.path}/`}</loc>`,
      );
    }
  });

  test('skip link and keyboard-visible header links', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/u);
    const link = page.locator('header a[href="/how-it-works"]');
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
  });

  test('header marks only the exact route current', async ({ page }) => {
    await page.goto('/learn/start-here');
    await expect(page.locator('header a[aria-current="page"]')).toHaveCount(0);
    await page.goto('/learn');
    await expect(page.locator('header a[aria-current="page"]')).toHaveText(
      'Learn',
    );
  });

  test('no horizontal overflow at the narrow widths', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop',
      'one project resizes the viewport',
    );
    for (const width of [320, 375, 641]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(route.path);
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        );
        expect(overflow, `${route.path} at ${width}`).toBe(false);
      }
    }
  });

  test('homepage beats, FAQ preview and CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.locator('main').getByText("Otter Crew's Poker Assistant"),
    ).toHaveCount(1);
    await expect(
      page.locator('main a[href="/how-it-works"]').first(),
    ).toHaveText(/See how it works/u);
    await expect(page.locator('main a[href="/solutions"]').first()).toHaveText(
      /What's free/u,
    );
    await expect(page.locator('main ol[role="list"] > li')).toHaveCount(7);
    await expect(
      page.locator('main ol[role="list"] > li').nth(3),
    ).toContainText(/exploit/iu);
    await expect(page.locator('main details')).toHaveCount(4);
  });

  test('/faq answers every question in order', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.locator('main details > summary')).toHaveText([
      'Do my hands ever leave my device?',
      'Which sites can I import from?',
      'What is free, exactly?',
      'Will heads-up stay free?',
      'What do packs cost?',
      'What happens to a pack after I buy it?',
      'Which table sizes and stack depths are solved?',
      'Is it solved for my rake?',
      'Can I use it while I play?',
      'Which platforms, and when?',
      'Does it do tournaments and ICM?',
      'Can I solve my own spots?',
      'How is this different from the cloud study tools?',
    ]);
  });

  test('/solutions states the free offer before the table and has no ICM row', async ({
    page,
  }) => {
    await page.goto('/solutions');
    const main = page.locator('main');
    const text = (await main.textContent()) ?? '';
    expect(text.indexOf('Heads-up, complete and free')).toBeLessThan(
      text.indexOf('A pack is a fixed set'),
    );
    await expect(main.locator('table tbody tr')).toHaveCount(30);
    await expect(main.locator('table')).not.toContainText(/ICM/u);
    await expect(main).toContainText('Prices are announced at launch.');
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}
