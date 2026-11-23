import { test, expect, type APIRequestContext } from '@playwright/test';

// API-тесты Restful Booker: https://restful-booker.herokuapp.com
// Адрес сервера (baseURL) задан в playwright.config.ts, проект 'api'

// Данные нового бронирования — «заполненный бланк»
const newBooking = {
  firstname: 'Maria',
  lastname: 'Test',
  totalprice: 100,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
};

// Помощник: создать бронирование и вернуть его номер
async function createBooking(request: APIRequestContext) {
  const response = await request.post('/booking', { data: newBooking });
  expect(response.status()).toBe(200);
  const created = await response.json();
  return created.bookingid;
}

// Помощник: получить токен («ключ-карту») по учебному логину администратора
async function getToken(request: APIRequestContext) {
  const response = await request.post('/auth', {
    data: { username: 'admin', password: 'password123' },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  return body.token;
}

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

  test('API-04: удаление без токена запрещено', async ({ request }) => {
    const id = await createBooking(request);

    // DELETE без «ключ-карты» -> 403 «доступ запрещён»
    const response = await request.delete('/booking/' + id);
    expect(response.status()).toBe(403);

    // Бронирование осталось на месте
    const getResponse = await request.get('/booking/' + id);
    expect(getResponse.status()).toBe(200);
  });

  test('API-05: изменение бронирования с токеном (PUT)', async ({ request }) => {
    const id = await createBooking(request);
    const token = await getToken(request);

    // Новые данные: меняем фамилию, цену, даты и пожелание
    const changedBooking = {
      ...newBooking,
      lastname: 'Changed',
      totalprice: 200,
      depositpaid: false,
      bookingdates: { checkin: '2026-12-10', checkout: '2026-12-15' },
      additionalneeds: 'Dinner',
    };

    // PUT с токеном в заголовке Cookie
    const response = await request.put('/booking/' + id, {
      data: changedBooking,
      headers: { Cookie: 'token=' + token },
    });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(changedBooking);

    // GET показывает уже изменённые данные
    const getResponse = await request.get('/booking/' + id);
    expect(await getResponse.json()).toEqual(changedBooking);
  });

  test('API-06: удаление бронирования с токеном', async ({ request }) => {
    const id = await createBooking(request);
    const token = await getToken(request);

    // DELETE с токеном. Сервер отвечает 201 Created — нестандартно
    // (обычно 200 или 204), но так он работает; отмечено как находка для баг-репорта
    const response = await request.delete('/booking/' + id, {
      headers: { Cookie: 'token=' + token },
    });
    expect(response.status()).toBe(201);

    // После удаления бронирования нет -> 404
    const getResponse = await request.get('/booking/' + id);
    expect(getResponse.status()).toBe(404);
  });
});
