import { test, expect } from '@playwright/test';

// Автотесты по тест-кейсам TC-01 — TC-04 из репозитория qa-portfolio
// https://github.com/msofina16/qa-portfolio/blob/main/saucedemo/test-cases.md

const PASSWORD = 'secret_sauce'; // публичный пароль учебного сайта

test.describe('Авторизация', () => {
  // Перед каждым тестом открываем страницу входа
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-01: успешный вход', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('TC-02: вход с пустыми полями', async ({ page }) => {
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toHaveText(
      'Epic sadface: Username is required',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-03: вход с неверным паролем', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('wrong_password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('TC-04: вход заблокированного пользователя', async ({ page }) => {
    await page.getByTestId('username').fill('locked_out_user');
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
