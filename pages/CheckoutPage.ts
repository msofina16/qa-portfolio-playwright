import { type Page, type Locator } from '@playwright/test';

// Page Object оформления заказа: три шага подряд
// 1) Checkout: Your Information — форма с именем, фамилией и индексом
// 2) Checkout: Overview — суммы заказа
// 3) Checkout: Complete — "Thank you for your order!"

export class CheckoutPage {
  // Что есть на страницах
  readonly page: Page;
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
    this.itemTotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  // Что можно сделать

  // Заполнить форму и нажать Continue.
  // Пустая строка '' — оставить поле пустым (для негативных тестов)
  async fillForm(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  // Прочитать три суммы на странице Overview числами.
  // Текст вида "Item total: $29.99" -> берём число после "$"
  async getTotals() {
    const toNumber = (text: string | null) => Number(text!.split('$')[1]);
    return {
      itemTotal: toNumber(await this.itemTotalLabel.textContent()),
      tax: toNumber(await this.taxLabel.textContent()),
      total: toNumber(await this.totalLabel.textContent()),
    };
  }

  // Нажать Finish — завершить заказ
  async finish() {
    await this.finishButton.click();
  }
}
