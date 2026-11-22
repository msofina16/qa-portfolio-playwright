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

  test('API-03: создание бронирования', async ({ request }) => {
    // Данные нового бронирования — «заполненный бланк»
    const newBooking = {
      firstname: 'Maria',
      lastname: 'Test',
      totalprice: 100,
      depositpaid: true,
      bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
      additionalneeds: 'Breakfast',
    };

    // Шаг 1: POST /booking — отправляем бланк в теле запроса (data)
    const createResponse = await request.post('/booking', { data: newBooking });
    expect(createResponse.status()).toBe(200);

    // Сервер выдал номер и вернул то, что мы отправили
    const created = await createResponse.json();
    expect(typeof created.bookingid).toBe('number');
    expect(created.booking).toEqual(newBooking);

    // Шаг 2: GET /booking/{номер} — бронирование действительно сохранилось
    const getResponse = await request.get('/booking/' + created.bookingid);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(newBooking);
  });
});
