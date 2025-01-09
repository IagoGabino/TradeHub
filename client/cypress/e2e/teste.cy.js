describe('Usuário - Registro e Login', () => {
    let email;
  
    before(() => {
      const timestamp = Date.now();
      email = `user${timestamp}@example.com`;
    });
  
    it('Deve registrar um novo usuário com sucesso', () => {
      cy.login('iago@gmail.com', '123');
      cy.get('.list-view').should('be.visible');
    });
  });
  