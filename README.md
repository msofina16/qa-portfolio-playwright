# QA Portfolio — автотесты на Playwright + TypeScript

Автоматизация тестирования учебных проектов. Продолжение ручного тестирования из репозитория [qa-portfolio](https://github.com/msofina16/qa-portfolio): тест-кейсы оттуда превращаются здесь в автотесты.

## Что тестируется

| Объект | Тип | Статус |
|---|---|---|
| [saucedemo.com](https://www.saucedemo.com) — интернет-магазин | UI / E2E | в работе |
| [Restful Booker](https://restful-booker.herokuapp.com) — API бронирования | API | в работе |

## Стек

Playwright · TypeScript · Node.js · GitHub Actions

## Как запустить

```bash
npm ci
npx playwright install
npx playwright test
```

Отчёт:

```bash
npx playwright show-report
```
