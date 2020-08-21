Cypress.Commands.add('getByTestId', (testId, options = {}) => cy.get(`[data-testid="${testId}"]`, options));
Cypress.Commands.add('getByTitle', (title, options = {}) => cy.get(`[title="${title}"]`, options));
Cypress.Commands.add('getPreviewPage', pageNum => {
    cy.getByTestId('bp')
        .find('.page[data-page-number]')
        .last()
        .then($lastPage => {
            const pageToUse = $lastPage.data('pageNumber') < pageNum ? 1 : pageNum;
            return cy.get(`.page[data-page-number=${pageToUse}]`);
        })
        .as('previewPage')
        .find('.loadingIcon', { timeout: 30000 })
        .should('not.exist');

    return cy.get('@previewPage');
});
Cypress.Commands.add('showPreview', (token, fileId, options) => {
    cy.server();
    cy.route('**/files/*').as('getFileInfo');

    cy.getByTestId('token').type(token);
    cy.getByTestId('token-set').click();
    cy.getByTestId('fileid').type(fileId);
    cy.getByTestId('fileid-set').click();

    cy.window().then(win => {
        win.loadPreview(options);
    });

    cy.wait('@getFileInfo');

    // Wait for .bp to load viewer
    return cy.getByTestId('bp', { timeout: 60000 }).should('have.class', 'bp-loaded');
});

Cypress.Commands.add('showControls', () => {
    cy.getByTestId('bp').trigger('mouseover');
    cy.getByTestId('bp-controls').should('be.visible');
});
