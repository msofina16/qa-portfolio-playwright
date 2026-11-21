import { type Page, type Locator } from '@playwright/test';

// Page Object страницы каталога (inventory.html)

export class InventoryPage {
  // Что есть на странице
  readonly page: Page;
  readonly sortSelect: Locator;
  readonly prices: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortSelect = page.getByTestId('product-sort-container');
    this.prices = page.getByTestId('inventory-item-price');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  // Что можно сделать на странице

  // Выбрать сортировку: 'lohi' — цена по возрастанию, 'hilo' — по убыванию
  async sortBy(option: string) {
    await this.sortSelect.selectOption(option);
  }

  // Собрать все цены со страницы числами: "$7.99" -> 7.99
  async getPrices() {
    const texts = await this.prices.allTextContents();
    return texts.map((text) => Number(text.replace('$', '')));
  }

  // Цена товара в каталоге по названию, например 'Sauce Labs Backpack'
  async getPriceOf(productName: string) {
    const product = this.page.getByTestId('inventory-item').filter({ hasText: productName });
    return product.getByTestId('inventory-item-price').textContent();
  }

  // Нажать Add to cart у товара.
  // productId — часть метки кнопки, например 'sauce-labs-backpack'
  // (метка кнопки целиком: 'add-to-cart-sauce-labs-backpack')
  async addToCart(productId: string) {
    await this.page.getByTestId('add-to-cart-' + productId).click();
  }

  // Кнопка Remove у товара (появляется после Add to cart)
  removeButton(productId: string) {
    return this.page.getByTestId('remove-' + productId);
  }

  // Открыть корзину (значок справа вверху)
  async openCart() {
    await this.cartLink.click();
  }
}
