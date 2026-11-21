import { type Page, type Locator } from '@playwright/test';

// Page Object страницы корзины (cart.html)
// Все элементы ищем только внутри списка корзины (cart-list):
// так тест не перепутает корзину с каталогом, пока страница перерисовывается

export class CartPage {
  // Что есть на странице
  readonly page: Page;
  readonly list: Locator;
  readonly items: Locator;
  readonly itemName: Locator;
  readonly itemQuantity: Locator;
  readonly itemPrice: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.list = page.getByTestId('cart-list');
    this.items = this.list.getByTestId('inventory-item');
    this.itemName = this.list.getByTestId('inventory-item-name');
    this.itemQuantity = this.list.getByTestId('item-quantity');
    this.itemPrice = this.list.getByTestId('inventory-item-price');
    this.checkoutButton = page.getByTestId('checkout');
  }

  // Что можно сделать на странице

  // Нажать Remove у товара, например 'sauce-labs-backpack'
  async remove(productId: string) {
    await this.list.getByTestId('remove-' + productId).click();
  }

  // Нажать Checkout — перейти к оформлению заказа
  async checkout() {
    await this.checkoutButton.click();
  }
}
