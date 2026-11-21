import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// Тест-кейсы TC-08, TC-09 из qa-portfolio, TC-11, TC-12 — дополнительные негативные тесты

test.describe('Оформление заказа', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // Предусловие: выполнен вход под standard_user, в корзине 1 товар, открыта корзина
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
  });

  test('TC-08: успешное оформление заказа', async () => {
    // Шаг 1: Checkout -> форма Your Information
    await cartPage.checkout();
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');

    // Шаги 2-3: заполнить форму, Continue -> страница Overview
    await checkoutPage.fillForm('Maria', 'Test', '0100');
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');

    // Шаг 4: Total = Item total + Tax
    const { itemTotal, tax, total } = await checkoutPage.getTotals();
    expect(total).toBeCloseTo(itemTotal + tax, 2);

    // Шаг 5: Finish -> "Thank you for your order!", корзина пустая
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('TC-09: оформление заказа без имени', async () => {
    await cartPage.checkout();

    // Шаг 1-2: First Name пустое, остальное заполнено, Continue
    await checkoutPage.fillForm('', 'Test', '0100');

    // Ошибка, остаёмся на форме
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('TC-11: оформление заказа без фамилии', async () => {
    await cartPage.checkout();

    // Шаг 1-2: Last Name пустое, остальное заполнено, Continue
    await checkoutPage.fillForm('Maria', '', '0100');

    // Ошибка, остаёмся на форме
    await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('TC-12: оформление заказа без индекса', async () => {
    await cartPage.checkout();

    // Шаг 1-2: Postal Code пустое, остальное заполнено, Continue
    await checkoutPage.fillForm('Maria', 'Test', '');

    // Ошибка, остаёмся на форме
    await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });
});
