describe('Todo API E2E Tests', () => {
  const baseUrl = 'http://localhost:5002';
  let authToken: string;
  let userId: number;

  before(() => {
    // Create a test user and get auth token
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@example.com`;
    
    cy.request({
      method: 'POST',
      url: `${baseUrl}/users/signup`,
      body: {
        email: testEmail,
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      authToken = response.body.token;
      userId = response.body.result.id;
    });
  });

  describe('Authentication', () => {
    it('should require authentication for protected routes', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/todo`,
        body: {
          title: 'Test Todo',
          description: 'Test Description',
          tags: ['test']
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should allow access with valid token', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/todo/userTodos/${userId}?page=1`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('data');
        expect(response.body).to.have.property('currentPage');
        expect(response.body).to.have.property('numberOfPages');
      });
    });
  });

  describe('Todo CRUD Operations', () => {
    let todoId: number;

    it('should create a new todo', () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo description',
        tags: ['test', 'e2e'],
        name: 'Test User'
      };

      cy.request({
        method: 'POST',
        url: `${baseUrl}/todo`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: todoData
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq(todoData.title);
        expect(response.body.description).to.eq(todoData.description);
        expect(response.body.creator).to.eq(userId);
        todoId = response.body.id;
      });
    });

    it('should get a specific todo', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/todo/${todoId}`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(todoId);
        expect(response.body.title).to.eq('Test Todo');
      });
    });

    it('should get user todos with pagination', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/todo/userTodos/${userId}?page=1`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
        expect(response.body.currentPage).to.eq(1);
        expect(response.body.numberOfPages).to.be.a('number');
      });
    });

    it('should update a todo', () => {
      const updatedData = {
        title: 'Updated Test Todo',
        description: 'This is an updated test todo description',
        tags: ['test', 'e2e', 'updated'],
        name: 'Test User'
      };

      cy.request({
        method: 'PATCH',
        url: `${baseUrl}/todo/${todoId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: updatedData
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.title).to.eq(updatedData.title);
        expect(response.body.description).to.eq(updatedData.description);
      });
    });

    it('should search todos', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/todo/search?searchQuery=Updated`
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        expect(response.body[0].title).to.include('Updated');
      });
    });

    it('should delete a todo', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/todo/${todoId}`,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Todo deleted successfully');
      });

      // Verify todo is deleted
      cy.request({
        method: 'GET',
        url: `${baseUrl}/todo/${todoId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });


});
