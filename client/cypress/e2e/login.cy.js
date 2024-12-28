describe('Funcionalidade de Registro', () => {
  const novoUsuario = {
    nome: 'Usuário de Teste Cypress',
    email: `cypressuser${Date.now()}@example.com`,
    celular: '(99) 99999-9999',
    senha: 'Test@1234'
  };

  beforeEach(() => {
    cy.visit('/login');
  });

  it('Abre o modal de registro', () => {
    cy.contains('Faça seu cadastro').click();

    cy.get('.modal-container').should('be.visible');
    cy.get('.register').within(() => {
      cy.get('h3').should('contain', 'seu cadastro');
      cy.get('input#nameReg').should('be.visible');
      cy.get('input#emailReg').should('be.visible');
      cy.get('input#cellphoneReg').should('be.visible');
      cy.get('input#passwordReg').should('be.visible');
      cy.get('button').should('contain', 'Cadastrar');
    });
  });

  it('Registra um novo usuário com sucesso', () => {
    cy.contains('Faça seu cadastro').click();

    cy.get('input#nameReg').type(novoUsuario.nome);
    cy.get('input#emailReg').type(novoUsuario.email);
    cy.get('input#cellphoneReg').type(novoUsuario.celular);
    cy.get('input#passwordReg').type(novoUsuario.senha);

    cy.get('button').contains('Cadastrar').click();

    cy.get('.modal-container').should('not.exist');

    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

  });
});
