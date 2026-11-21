import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Автотесты по тест-кейсам TC-01 — TC-04 из репозитория qa-portfolio
// https://github.com/msofina16/qa-portfolio/blob/main/saucedemo/test-cases.md

const PASSWORD = 'secret_sauce'; // публичный пароль учебного сайта

test.describe('Авторизация', () => {
  let loginPage: LoginPage;

  // Перед каждым тестом открываем страницу входа
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('TC-01: успешный вход', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('TC-02: вход с пустыми полями', async ({ page }) => {
    await loginPage.loginButton.click();

    await loginPage.expectError('Epic sadface: Username is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-03: вход с неверным паролем', async ({ page }) => {
    await loginPage.login('standard_user', 'wrong_password');

    await loginPage.expectError(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-04: вход заблокированного пользователя', async ({ page }) => {
    await loginPage.login('locked_out_user', PASSWORD);

    await loginPage.expectError('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-10: выход из аккаунта', async ({ page }) => {
    // Предусловие: выполнен вход под standard_user
    await loginPage.login('standard_user', PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);

    // Шаги 1-2: меню -> Logout -> страница входа
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(loginPage.loginButton).toBeVisible();

    // Шаг 3: кнопка «Назад» -> каталог не открывается
    await page.goBack();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page.getByTestId('inventory-list')).toBeHidden();
  });
});
