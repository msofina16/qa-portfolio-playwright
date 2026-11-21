import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

// Тест-кейсы TC-06, TC-07 из qa-portfolio

test.describe('Корзина', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  // Предусловие: выполнен вход под standard_user, корзина пустая
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-06: добавление товара в корзину', async () => {
    // Запоминаем цену рюкзака в каталоге
    const catalogPrice = await inventoryPage.getPriceOf('Sauce Labs Backpack');

    // Шаг 1: Add to cart -> кнопка стала Remove, на корзине цифра 1
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.removeButton('sauce-labs-backpack')).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Шаг 2: в корзине рюкзак, количество 1, цена как в каталоге
    await inventoryPage.openCart();
    await expect(cartPage.itemName).toHaveText('Sauce Labs Backpack');
    await expect(cartPage.itemQuantity).toHaveText('1');
    await expect(cartPage.itemPrice).toHaveText(catalogPrice!);
  });

  test('TC-07: удаление товара из корзины', async () => {
    // Предусловие: в корзине 1 товар
    await inventoryPage.addToCart('sauce-labs-backpack');

    // Шаг 1: открыть корзину -> 1 товар
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(1);

    // Шаг 2: Remove -> товара нет, цифры на значке нет
    await cartPage.remove('sauce-labs-backpack');
    await expect(cartPage.items).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
