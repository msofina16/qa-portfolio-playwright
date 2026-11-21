import { type Page, type Locator, expect } from '@playwright/test';

// Page Object страницы входа https://www.saucedemo.com
// Здесь собрано всё, что тесты делают на этой странице:
// где лежат поля и кнопка, как войти и как прочитать ошибку.

export class LoginPage {
  // Элементы страницы (что есть на странице)
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  // Действия на странице (что пользователь может сделать)

  // Открыть страницу входа
  async open() {
    await this.page.goto('/');
  }

  // Ввести логин и пароль, нажать Login
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Проверить текст ошибки под формой
  async expectError(text: string) {
    await expect(this.errorMessage).toHaveText(text);
  }
}
