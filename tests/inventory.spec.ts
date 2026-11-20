import { test, expect } from '@playwright/test';

// Тест-кейс TC-05 из qa-portfolio

test.describe('Каталог', () => {
  // Предусловие: выполнен вход под standard_user
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-05: сортировка по цене (от меньшей к большей)', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('lohi');

    // Собираем все цены со страницы: "$7.99" -> 7.99
    const priceTexts = await page.getByTestId('inventory-item-price').allTextContents();
    const prices = priceTexts.map((text) => Number(text.replace('$', '')));

    // Ожидаем, что цены идут по возрастанию
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});
