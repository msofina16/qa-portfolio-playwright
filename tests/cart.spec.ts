import { test, expect } from '@playwright/test';

// Тест-кейсы TC-06, TC-07 из qa-portfolio

test.describe('Корзина', () => {
  // Предусловие: выполнен вход под standard_user, корзина пустая
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('TC-06: добавление товара в корзину', async ({ page }) => {
    // Запоминаем цену рюкзака в каталоге
    const backpack = page.getByTestId('inventory-item').filter({ hasText: 'Sauce Labs Backpack' });
    const catalogPrice = await backpack.getByTestId('inventory-item-price').textContent();

    // Шаг 1: Add to cart -> кнопка стала Remove, на корзине цифра 1
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Шаг 2: в корзине рюкзак, количество 1, цена как в каталоге
    // Ищем элементы только внутри списка корзины (cart-list): так тест не перепутает
    // корзину с каталогом, пока страница ещё перерисовывается
    await page.getByTestId('shopping-cart-link').click();
    const cart = page.getByTestId('cart-list');
    await expect(cart.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(cart.getByTestId('item-quantity')).toHaveText('1');
    await expect(cart.getByTestId('inventory-item-price')).toHaveText(catalogPrice!);
  });

  test('TC-07: удаление товара из корзины', async ({ page }) => {
    // Предусловие: в корзине 1 товар
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

    // Шаг 1: открыть корзину -> 1 товар
    await page.getByTestId('shopping-cart-link').click();
    const cart = page.getByTestId('cart-list');
    await expect(cart.getByTestId('inventory-item')).toHaveCount(1);

    // Шаг 2: Remove -> товара нет, цифры на значке нет
    await cart.getByTestId('remove-sauce-labs-backpack').click();
    await expect(cart.getByTestId('inventory-item')).toHaveCount(0);
    await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
  });
});
