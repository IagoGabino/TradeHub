describe('LoginView Component', () => {
  // Antes de cada teste, visite a p�gina de login
  beforeEach(() => {
    cy.visit('/login') // Ajuste a rota conforme a sua aplica��o
  })

  it('deve exibir o bot�o de entrar', () => {
    cy.get('#login button')
      .should('be.visible')
      .and('contain', 'Entrar')
  })

  it('deve alternar o tipo do campo de senha ao clicar no �cone', () => {
    // Verifica se o campo de senha est� inicialmente com o tipo 'password'
    cy.get('#password').should('have.attr', 'type', 'password')

    // Clica no �cone de olho para mostrar a senha
    cy.get('.login .form .input .fa-eye').click()
    cy.get('#password').should('have.attr', 'type', 'text')

    // Clica novamente para ocultar a senha
    cy.get('.login .form .input .fa-eye').click()
    cy.get('#password').should('have.attr', 'type', 'password')
  })
})
