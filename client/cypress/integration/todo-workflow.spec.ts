describe('Todo Workflow E2E Tests', () => {
  beforeEach(() => {
    cy.login('test@test.com', 'test123'); // Login before each test
  });

  afterEach(() => {
    cy.logout(); // Logout after each test
  });

  it('should CREATE a new todo', () => {
    const todoTitle = 'Test Create Todo';
    const todoDescription = 'This is a test todo for creation.';
    const todoTags = ['test', 'create'];

    cy.createTodo(todoTitle, todoDescription, todoTags);

    // Verify todo appears on dashboard
    cy.contains(todoTitle).should('be.visible');
    cy.contains(todoDescription.substring(0, 50)).should('be.visible');
  });

  it('should READ/view an existing todo', () => {
    const todoTitle = 'Test Read Todo';
    const todoDescription = 'This is a test todo for reading.';
    const todoTags = ['test', 'read'];

    // Create a todo first
    cy.createTodo(todoTitle, todoDescription, todoTags);

    // View the todo via eye icon inside the same card
    cy.contains(todoTitle)
      .closest('.card')
      .within(() => {
        cy.get('.fa-eye').click({ force: true });
      });

    cy.url().should('include', '/todo/');
    cy.contains(todoTitle).should('be.visible');
    cy.contains(todoDescription).should('be.visible');

    // Return to dashboard
    cy.visit('/');
  });

  it('should UPDATE an existing todo', () => {
    const originalTitle = 'Test Update Todo';
    const originalDescription = 'This is the original description.';
    const originalTags = ['test', 'update'];

    // Create a todo first
    cy.createTodo(originalTitle, originalDescription, originalTags);

    // Edit the todo within the specific card
    cy.contains(originalTitle)
      .closest('.card')
      .within(() => {
        cy.get('.fa-edit').click({ force: true });
      });
    cy.url().should('include', '/editTodo/');

    // Update the todo
    const updatedTitle = 'Updated Todo Title';
    const updatedDescription = 'This is the updated description.';
    
    cy.get('input[name="title"]').clear().type(updatedTitle);
    cy.get('textarea[name="description"]').clear().type(updatedDescription);
    cy.get('button').contains('Update').click();

    // Verify updated todo appears on dashboard
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains(updatedTitle).should('be.visible');
    cy.contains(originalTitle).should('not.exist');
  });

  it('should DELETE an existing todo', () => {
    const todoTitle = 'Test Delete Todo';
    const todoDescription = 'This is a test todo for deletion.';
    const todoTags = ['test', 'delete'];

    // Create a todo first
    cy.createTodo(todoTitle, todoDescription, todoTags);

    // Verify todo exists
    cy.contains(todoTitle).should('be.visible');

    // Delete the todo within the specific card
    cy.contains(todoTitle)
      .closest('.card')
      .within(() => {
        cy.get('.fa-trash').click({ force: true });
      });

    // Verify todo is removed
    cy.contains(todoTitle).should('not.exist');
  });
});
