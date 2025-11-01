describe('burger constructor', () => {
  beforeEach(() => {
    // Мок ингредиентов
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('ingredients');

    // Подставляем токены
    cy.setCookie('accessToken', 'test-access');
    localStorage.setItem('refreshToken', 'test-refresh');

    // Мок юзера
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      fixture: 'user.json'
    }).as('user');

    // Мок создания заказа
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
      fixture: 'order.json'
    }).as('order');

    // Открываем главную страницу
    cy.visit('/');
    cy.wait('@ingredients');
  });

  it('добавление ингредиента через кнопку на карточке', () => {
    // Находим первую карточку и внутри ищем кнопку "Добавить"
    cy.get('[data-testid="ingredient-card"]')
      .first()
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    // Проверяем, что ингредиент появился в конструкторе
    cy.get('[data-testid="constructor-area"]').should(
      'contain.text',
      'Булка 1'
    );
  });

  it('создание заказа с добавленным ингредиентом', () => {
    // Добавляем ингредиент
    cy.get('[data-testid="ingredient-card"]')
      .first()
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    // Кликаем кнопку "Оформить заказ"
    cy.get('[data-testid="order-button"]').click();

    // Ждём запрос на создание заказа
    cy.wait('@order');

    // Проверяем модальное окно с номером заказа
    cy.get('[data-testid="modal"]').should('exist').and('contain.text', '7777');

    // Закрываем модалку
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверяем, что конструктор очищен
    cy.get('[data-testid="constructor-area"]').should(
      'not.contain.text',
      'Булка 1'
    );
  });
});
