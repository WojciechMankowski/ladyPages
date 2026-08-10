import { test, expect, type Page } from '@playwright/test';

// Baner cookies (z-index 2100, fixed na dole) nakłada się na inne elementy
// interaktywne (np. linki w pełnoekranowym menu mobilnym), więc w testach,
// które nie dotyczą samego baneru, odrzucamy go od razu po wejściu na stronę.
async function dismissCookieBanner(page: Page) {
  const banner = page.locator('.cookie-consent');
  if (await banner.isVisible().catch(() => false)) {
    await banner.getByRole('button', { name: 'Akceptuj' }).click();
  }
}

test.describe('Zapis do formularza (Hero)', () => {
  test('3.1 błędne dane → poprawa → sukces, MailerLite zamockowany', async ({ page }) => {
    // Przechwytujemy wywołanie JSONP i sami wywołujemy callback z sukcesem,
    // zamiast robić prawdziwy request do assets.mailerlite.com.
    await page.route('https://assets.mailerlite.com/jsonp/**', async (route) => {
      const url = new URL(route.request().url());
      const callback = url.searchParams.get('callback');
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `${callback}({success:true})`,
      });
    });

    await page.goto('/');
    await dismissCookieBanner(page);

    await page.fill('#hero-name', 'A');
    await page.fill('#hero-email', 'zly-email');
    await expect(page.locator('#hero-name-error')).toHaveText('Imię powinno mieć co najmniej 2 znaki.');
    await expect(page.locator('#hero-email-error')).toContainText('poprawny adres e-mail');

    await page.fill('#hero-name', 'Krystyna');
    await page.fill('#hero-email', 'krystyna@firma.pl');
    await page.check('#hero-consent');
    await page.click('.hero-inline-form button[type="submit"]');

    // #form-status renderuje się jako rodzeństwo <form>, wewnątrz wspólnego
    // .hero-form-container — nie jest zagnieżdżony w .hero-inline-form.
    await expect(page.locator('.hero-form-container .form-status.success')).toContainText('Gotowe!');
    await expect(page.locator('#hero-name')).toHaveValue('');
  });
});

test.describe('Motyw jasny/ciemny', () => {
  // Wymuszamy znany punkt startowy (ciemny), bo domyślny colorScheme
  // Playwrighta to "light" — bez tego klik przełącznika mógłby zdjąć
  // klasę "light" zamiast ją dodać.
  test.use({ colorScheme: 'dark' });

  test('3.2 zmiana motywu zostaje zachowana po przeładowaniu strony', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
    await expect(page.locator('html')).not.toHaveClass(/light/);

    await page.click('.theme-toggle');
    await expect(page.locator('html')).toHaveClass(/light/);

    await page.reload();

    await expect(page.locator('html')).toHaveClass(/light/);
  });
});

test.describe('Nawigacja mobilna', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('3.3 otwarcie menu, klik linku nawiguje do sekcji i zamyka menu', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);

    await page.click('.mobile-nav-toggle');
    await expect(page.locator('.main-nav')).toHaveClass(/active/);

    await page.locator('.nav-link', { hasText: 'O mnie' }).click();

    await expect(page.locator('.main-nav')).not.toHaveClass(/active/);
    await expect(page).toHaveURL(/#about$/);
  });
});

test.describe('Zgoda na cookies', () => {
  test('3.4 akceptacja baneru cookies nie pojawia się ponownie po reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.cookie-consent')).toBeVisible();

    await page.click('.cookie-consent button:has-text("Akceptuj")');
    await expect(page.locator('.cookie-consent')).toHaveCount(0);

    await page.reload();

    await expect(page.locator('.cookie-consent')).toHaveCount(0);
  });
});

test.describe('Niezależność formularzy Hero i Contact', () => {
  test('3.5 wypełnienie formularza Hero bez wysyłki nie wpływa na formularz Contact', async ({ page }) => {
    await page.goto('/');
    await dismissCookieBanner(page);
    await page.fill('#hero-name', 'Krystyna');
    await page.fill('#hero-email', 'krystyna@firma.pl');

    await page.locator('#final-name').scrollIntoViewIfNeeded();

    await expect(page.locator('#final-name')).toHaveValue('');
    await expect(page.locator('#final-email')).toHaveValue('');
  });
});
