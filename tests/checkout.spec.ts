import { test, expect } from '@playwright/test';

// Тест-кейсы TC-08, TC-09 из qa-portfolio

test.describe('Оформление заказа', () => {
  // Предусловие: выполнен вход под standard_user, в корзине 1 товар, открыта корзина
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('shopping-cart-link').click();
  });

  test('TC-08: успешное оформление заказа', async ({ page }) => {
    // Шаг 1: Checkout -> форма Your Information
    await page.getByTestId('checkout').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');

    // Шаги 2-3: заполнить форму, Continue -> страница Overview
    await page.getByTestId('firstName').fill('Maria');
    await page.getByTestId('lastName').fill('Test');
    await page.getByTestId('postalCode').fill('0100');
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');

    // Шаг 4: Total = Item total + Tax
    // Текст вида "Item total: $29.99" -> берём число после "$"
    const toNumber = (text: string | null) => Number(text!.split('$')[1]);
    const itemTotal = toNumber(await page.getByTestId('subtotal-label').textContent());
    const tax = toNumber(await page.getByTestId('tax-label').textContent());
    const total = toNumber(await page.getByTestId('total-label').textContent());
    expect(total).toBeCloseTo(itemTotal + tax, 2);

    // Шаг 5: Finish -> "Thank you for your order!", корзина пустая
    await page.getByTestId('finish').click();
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
  });

  test('TC-09: оформление заказа без имени', async ({ page }) => {
    await page.getByTestId('checkout').click();

    // Шаг 1: First Name пустое, остальное заполнено
    await page.getByTestId('lastName').fill('Test');
    await page.getByTestId('postalCode').fill('0100');

    // Шаг 2: Continue -> ошибка, остаёмся на форме
    await page.getByTestId('continue').click();
    await expect(page.getByTestId('error')).toHaveText('Error: First Name is required');
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
  });
});
