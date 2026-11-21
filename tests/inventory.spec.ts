import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// Тест-кейс TC-05 из qa-portfolio

test.describe('Каталог', () => {
  // Предусловие: выполнен вход под standard_user
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-05: сортировка по цене (от меньшей к большей)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('lohi');

    // Собираем все цены со страницы: "$7.99" -> 7.99
    const prices = await inventoryPage.getPrices();

    // Ожидаем, что цены идут по возрастанию
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});
