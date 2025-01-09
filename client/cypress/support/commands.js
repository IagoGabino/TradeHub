// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload';
Cypress.Commands.add('register', (email, password) => {
    cy.visit('localhost:8080/#/login');

    // Abrir o modal de registro
    cy.get('span').contains('Faça seu cadastro').click();

    // Preencher os campos de registro
    cy.get('input#nameReg').type('Teste Usuário');
    cy.get('input#emailReg').type(email);
    cy.get('input#cellphoneReg').type('(11) 91234-5678');
    cy.get('input#passwordReg').type(password);

    // Enviar o formulário de registro
    cy.get('.submit-register-btn button').click();

    // Verificar a mensagem de sucesso
    cy.contains('Usuário cadastrado com sucesso!').should('be.visible');

    // Verificar se o usuário foi redirecionado para a página inicial
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});
