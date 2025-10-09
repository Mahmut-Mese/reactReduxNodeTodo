// Custom commands for Cypress tests

Cypress.Commands.add('login', (email = 'test@test.com', password = 'test123') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button').contains('Login').click();
  cy.location('pathname', { timeout: 15000 }).should('eq', '/');
  cy.get('a', { timeout: 15000 }).should('contain', 'Logout');
});

Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    const hasLogout = $body.find('a:contains("Logout")').length > 0;
    if (hasLogout) {
      cy.contains('a', 'Logout').click();
      cy.get('a').should('contain', 'Login');
    }
  });
});

Cypress.Commands.add('createTodo', (title: string, description: string, tags: string[] = []) => {
  // Ensure authenticated via localStorage-backed login
  cy.window().then((win) => {
    const hasProfile = !!win.localStorage.getItem('profile');
    if (!hasProfile) {
      cy.login();
    }
  });

  // Go directly to add page
  cy.visit('/addTodo');

  // If PrivateRoute rendered Login inline, perform login and retry
  cy.get('body', { timeout: 15000 }).then(($body) => {
    if ($body.find('h5:contains("Sign In")').length > 0) {
      cy.login();
      cy.visit('/addTodo');
    }
  });

  cy.url({ timeout: 20000 }).should('include', '/addTodo');
  // Wait for inputs instead of relying on header text
  cy.get('input[placeholder="Enter Title"]', { timeout: 20000 })
    .should('be.visible')
    .type(title);
  cy.get('textarea[placeholder="Enter Description"]', { timeout: 20000 })
    .should('be.visible')
    .type(description);
  if (tags.length > 0) {
    cy.get('input[name="tags"]').type(tags.join(', '));
  }
  cy.get('button').contains('Submit').click();
  cy.url().should('include', '/');
});
