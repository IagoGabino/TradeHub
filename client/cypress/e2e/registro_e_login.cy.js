describe('Usuário - Registro e Login', () => {
  let randomEmail;

  before(() => {
    // Gerar um email para cada execução
    const timestamp = Date.now();
    randomEmail = `user${timestamp}@example.com`;
  });

  it('Deve registrar um novo usuário com sucesso', () => {
    cy.visit('/login');

    // Abrir o modal de registro
    cy.get('span').contains('Faça seu cadastro').click();

    // Preencher os campos de registro
    cy.get('input#nameReg').type('Teste Usuário');
    cy.get('input#emailReg').type(randomEmail);
    cy.get('input#cellphoneReg').type('(11) 91234-5678');
    cy.get('input#passwordReg').type('Senha123');

    // Enviar o formulário de registro
    cy.get('.submit-register-btn button').click();

    // Verificar a mensagem de sucesso
    cy.contains('Usuário cadastrado com sucesso!').should('be.visible');

    // Verificar se o usuário foi redirecionado para a página inicial
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('Deve permitir que um usuário faça login com credenciais válidas', () => {
    cy.visit('/login');

    // Preencher os campos de login
    cy.get('input#email').type(randomEmail);
    cy.get('input#password').type('Senha123');

    // Enviar o formulário de login
    cy.get('.button button').click();

    // Verificar a mensagem de boas-vindas
    cy.contains('Bem vindo(a)!').should('be.visible');

    // Verificar se o usuário foi redirecionado para a página inicial
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
