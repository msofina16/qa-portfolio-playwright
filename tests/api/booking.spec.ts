import { test, expect } from '@playwright/test';

// API-тесты Restful Booker: https://restful-booker.herokuapp.com
// Адрес сервера (baseURL) задан в playwright.config.ts, проект 'api'

test.describe('API: бронирования', () => {
  test('API-01: получить бронирование по номеру', async ({ request }) => {
    // Запрос: GET /booking/1 — «покажи бронирование №1»
    const response = await request.get('/booking/1');

    // Проверка 1: код ответа 200 — бронирование найдено
    expect(response.status()).toBe(200);

    // Проверка 2: в ответе есть имя, фамилия и цена нужного типа.
    // Конкретные значения не проверяем: учебный сервер сам меняет данные
    const booking = await response.json();
    expect(typeof booking.firstname).toBe('string');
    expect(typeof booking.lastname).toBe('string');
    expect(typeof booking.totalprice).toBe('number');
  });

  test('API-02: несуществующее бронирование', async ({ request }) => {
    // Запрос: GET /booking/999999 — такого номера нет
    const response = await request.get('/booking/999999');

    // Проверка: код ответа 404 — «не найдено»
    expect(response.status()).toBe(404);
  });
});
