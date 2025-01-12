describe('Perfil - Editar informações', () => {
    let email;
    let password;
    before(() => {
        const timestamp = Date.now();
        email = `user${timestamp}@example.com`;
        password = '123';
        cy.register(email, password);
        cy.wait(500);
    });

    it('Deve cadastrar um novo produto', () => {
        // vai para o perfil do usuário
        cy.visit('/');
        cy.visit('/profile');

        // abre a janela de cadastrar produto
        cy.get('.user-products-options').within(() => {
            cy.get('.right h2').click();
        });

        // seleciona e preenche os inputs de texto
        cy.get('.text-inputs').within(() => {
            cy.get('input').eq(0).type('Copo Térmico');
            cy.get('input').eq(1).type('22000');
        });

        // seleciona e preenche a descrição do item
        cy.get('textarea.description-area').type('Copo Térmico de qualidade para manter suas bebidas geladas por um período estendido de tempo');

        // salva o produto
        cy.get('button.save').click();

        // verifica se a mensagem de sucesso apareceu
        cy.contains('Produto cadastrado com sucesso').should('be.visible');

        // verifica se o produto apareceu na tela
        cy.get('.prod-list-profile').should('not.be.empty');
    });
});
