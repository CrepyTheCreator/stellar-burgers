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

    cy.visit('/');
    cy.wait('@ingredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.clear();
  });

  it('добавление ингредиента через кнопку на карточке', () => {
    cy.get('[data-testid="ingredient-card"]')
      .first()
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    cy.get('[data-testid="constructor-area"]').should(
      'contain.text',
      'Булка 1'
    );
  });

  it('создание заказа с добавленным ингредиентом', () => {
    cy.get('[data-testid="ingredient-card"]')
      .first()
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    cy.get('[data-testid="order-button"]').click();
    cy.wait('@order');

    cy.get('[data-testid="modal"]').should('exist').and('contain.text', '7777');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.get('[data-testid="constructor-area"]').should(
      'not.contain.text',
      'Булка 1'
    );
  });

  it('открытие/закрытие модалки описания ингредиента', () => {
    cy.get('[data-testid="ingredient-card"]').first().click();
    cy.get('[data-testid="modal"]').should('exist');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('корректные данные ингредиента в модалке', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const first = data[0];

      cy.get('[data-testid="ingredient-card"]').first().click();

      cy.get('[data-testid="modal"]').within(() => {
        cy.contains(first.name).should('exist');
        cy.contains(first.calories.toString()).should('exist');
        cy.contains(first.proteins.toString()).should('exist');
        cy.contains(first.fat.toString()).should('exist');
        cy.contains(first.carbohydrates.toString()).should('exist');
      });
    });
  });
});
