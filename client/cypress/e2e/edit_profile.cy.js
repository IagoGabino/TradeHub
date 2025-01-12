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

    it('Deve editar o nome e telefone do perfil', () => {
        // vai para o perfil do usuário
        cy.visit('/');
        cy.visit('/profile');

        // navega para a página de cadastro
        cy.get('.options h1').eq(2).click();

        // limpa o input de nome caso haja algo escrito
        cy.get('input#name').clear();
        cy.get('input#name').type('Matheus');

        // limpa o input de telefone caso haja algo escrito
        cy.get('input#cellphone').clear();
        cy.get('input#cellphone').type('31987654321');

        // clica no botão de salvar
        cy.get('.submit-button button').click();

        // verifica se a mensagem de sucesso apareceu
        cy.contains('Dados atualizados com sucesso!').should('be.visible');

        // verifica se os inputs foram limpos
        cy.get('input#name').should('be.empty');
        cy.get('input#cellphone').should('be.empty');
        cy.get('input#email').should('be.empty');
    });
});
