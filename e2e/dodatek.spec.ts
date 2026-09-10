import { test, expect, type Page } from '@playwright/test';

async function dismissCookieBanner(page: Page) {
  const banner = page.locator('.cookie-consent');
  if (await banner.isVisible().catch(() => false)) {
    await banner.getByRole('button', { name: 'Akceptuj' }).click();
  }
}

// Przechwytujemy JSONP MailerLite i sami wołamy callback z sukcesem,
// zamiast robić prawdziwy request do assets.mailerlite.com.
async function mockMailerLite(page: Page) {
  await page.route('https://assets.mailerlite.com/jsonp/**', async (route) => {
    const url = new URL(route.request().url());
    const callback = url.searchParams.get('callback');
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `${callback}({success:true})`,
    });
  });
}

test.describe('Strona dodatku — wejście z ?src', () => {
  test('4.1 ?src=email pokazuje pełną instrukcję bez bramy zapisu', async ({ page }) => {
    await page.goto('/dodatek.html?src=email');
    await dismissCookieBanner(page);

    await expect(page.locator('h1')).toHaveText(
      'Jak zamienić wiadomość z Teams w zadanie w Planerze',
    );
    await expect(page.locator('.bonus-wip')).toBeVisible();
    await expect(page.locator('.bonus-gate')).toHaveCount(0);

    // Odblokowanie jest zapamiętane: wejście na goły adres nadal pokazuje pełną treść.
    await page.goto('/dodatek.html');
    await expect(page.locator('.bonus-gate')).toHaveCount(0);
    await expect(page.locator('.bonus-wip')).toBeVisible();
  });
});

test.describe('Strona dodatku — wejście bez ?src', () => {
  test('4.2 goły adres pokazuje zajawkę i formularz zapisu', async ({ page }) => {
    await page.goto('/dodatek.html');
    await dismissCookieBanner(page);

    await expect(page.locator('.bonus-gate')).toBeVisible();
    await expect(page.locator('#bonus-name')).toBeVisible();
    // pierwszy krok jest widoczny jako zajawka, ale nie adnotacja o kolejnych krokach
    await expect(page.getByText('Utwórz zespół w Teams')).toBeVisible();
    await expect(page.locator('.bonus-wip')).toHaveCount(0);
  });

  test('4.3 wypełnienie formularza zapisu kończy się komunikatem sukcesu', async ({ page }) => {
    await mockMailerLite(page);
    await page.goto('/dodatek.html');
    await dismissCookieBanner(page);

    await page.fill('#bonus-name', 'Krystyna');
    await page.fill('#bonus-email', 'krystyna@firma.pl');
    await page.check('#bonus-consent');
    await page.click('.bonus-form button[type="submit"]');

    await expect(page.locator('.bonus-form .form-status.success')).toContainText(
      'Gotowe!',
    );
  });
});

test.describe('Strona dodatku — SEO', () => {
  test('4.4 strona ma meta robots noindex', async ({ page }) => {
    await page.goto('/dodatek.html');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );
  });
});
