// cypress.config.js

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Define onde o Cypress deve apontar quando usamos cy.visit('/'), cy.visit('/login'), etc.
    baseUrl: 'http://localhost:8080',
    
    // Opções de timeout e viewport que você pode personalizar
    defaultCommandTimeout: 8000,
    viewportWidth: 1366,
    viewportHeight: 768,
    
    // Se quiser desabilitar o 'hot reload' dos testes, deixe como false
    watchForFileChanges: true,
    
    setupNodeEvents(on, config) {
      // Aqui você pode configurar event listeners do Cypress, plugins, etc.
      // Exemplo (logs no console):
      on('before:browser:launch', (browser = {}, launchOptions) => {
        console.log('Iniciando testes no browser:', browser.name, browser.version);
        return launchOptions;
      });
    },
  },
});
