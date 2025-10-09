describe('Login & Register Flow E2E Tests', () => {
  it('should LOGIN successfully with valid credentials', () => {
    // Visit login page
    cy.visit('/login');
    
    // Use custom login command
    cy.login('test@test.com', 'test123');
    
    // Should show logout option in header
    cy.get('a').should('contain', 'Logout');
  });

  it('should handle LOGIN error with invalid credentials', () => {
    // Visit login page
    cy.visit('/login');
    
    // Fill in invalid credentials
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    
    // Submit the form
    cy.get('button').contains('Login').click();
    
    // Should show error message or stay on login page
    cy.url().should('include', '/login');
  });

  it('should REGISTER successfully with valid data', () => {
    // Visit register page
    cy.visit('/register');
    
    const timestamp = Date.now();
    const newEmail = `newuser${timestamp}@test.com`;
    
    // Fill in form with new user data
    cy.get('input[name="firstName"]').type('New');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type(newEmail);
    cy.get('input[name="password"]').type('newpassword123');
    cy.get('input[name="confirmPassword"]').type('newpassword123');
    
    // Submit the form
    cy.get('button').contains('Register').click();
    
    // Should redirect to dashboard and show logout option
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get('a').should('contain', 'Logout');
  });

  it('should handle REGISTER error with existing email', () => {
    // Visit register page
    cy.visit('/register');
    
    // Fill in form with existing email
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('test@test.com'); // Existing email
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    // Submit the form
    cy.get('button').contains('Register').click();
    
    // Should show error message or stay on register page
    cy.url().should('include', '/register');
  });
});
