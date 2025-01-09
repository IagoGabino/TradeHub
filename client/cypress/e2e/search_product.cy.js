describe('Produto - Buscar Produto', () => {
    let email;
    let password;
    before(() => {
      const timestamp = Date.now();
      email = `user${timestamp}@example.com`;
      password = '123';
      cy.register(email, password);
      cy.wait(500);
    });
  
    it('Deve buscar um produto pelo nome com sucesso', () => {      
        // Intercepta a API para fornecer dados simulados de produtos
        cy.intercept('GET', '/products', {
            statusCode: 200,
            body: [
                { id: 1, nome: 'Livro de Aventura', descricao: 'Um livro cheio de aventuras.', preco: 25.5, idVendedor: 2, foto: 'uploads\\aventura.jpg' },
                { id: 2, nome: 'Romance Clássico', descricao: 'Um clássico para os amantes de romance.', preco: 30.0, idVendedor: 2, foto: 'uploads\\romance.jpg' },
                { id: 3, nome: 'História da Arte', descricao: 'Uma jornada pela história da arte.', preco: 45.0, idVendedor: 2, foto: 'uploads\\arte.jpg' },
            ],
        }).as('getProducts');

        // Visita a página inicial
        cy.visit('/');

        // Aguarda a API ser chamada e o DOM ser renderizado
        cy.wait('@getProducts');

        // Verifica que todos os produtos estão visíveis inicialmente
        cy.contains('Livro de Aventura').should('be.visible');
        cy.contains('Romance Clássico').should('be.visible');
        cy.contains('História da Arte').should('be.visible');

        // Busca por um produto específico
        cy.get('#search').type('Romance');
        cy.wait(500); // Aguarda o debounce da busca, se existir

        // Verifica que apenas o produto buscado está visível
        cy.contains('Romance Clássico').should('be.visible');
        cy.contains('Livro de Aventura').should('not.exist');
        cy.contains('História da Arte').should('not.exist');
    });
  });
  