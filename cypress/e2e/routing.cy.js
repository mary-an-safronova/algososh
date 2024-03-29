describe('app works correctly with routes', function() {
    beforeEach('should visible the "Main" page', () => {
        cy.visit('/');
        cy.contains('МБОУ АЛГОСОШ').should('be.visible');
    });

    it('should navigate to the "String" page after clicking the "Link" component with "to" prop set to "/recursion" and return to the "main" page after clicking the "p" with text "К оглавлению"', () => {
        cy.get('a[href*="#/recursion"]').click();
        cy.get('h3').should('have.text', 'Строка');
    });

    it('should navigate to the "Fibonacci" page after clicking the "Link" component with "to" prop set to "/fibonacci" and return to the "main" page after clicking the "p" with text "К оглавлению"', () => {
        cy.get('a[href*="#/fibonacci"]').click();
        cy.get('h3').should('have.text', 'Последовательность Фибоначчи');
    });

    it('should navigate to the "Sorting" page after clicking the "Link" component with "to" prop set to "/sorting" and return to the "main" page after clicking the "p" with text "К оглавлению"', () => {
        cy.get('a[href*="#/sorting"]').click();
        cy.get('h3').should('have.text', 'Сортировка массива');
    });

    it('should navigate to the "Stack" page after clicking the "Link" component with "to" prop set to "/stack" and return to the "main" page after clicking the "p" with text "К оглавлению"', () => {
        cy.get('a[href*="#/stack"]').click();
        cy.get('h3').should('have.text', 'Стек');
    });

    it('should navigate to the "Queue" page after clicking the "Link" component with "to" prop set to "/queue" and return to the "main" page after clicking the "p" with text "К оглавлению"', () => {
        cy.get('a[href*="#/queue"]').click();
        cy.get('h3').should('have.text', 'Очередь');
    });

    it('should navigate to the "List" page after clicking the "Link" component with "to" prop set to "/list" and return to the "main" page after clicking the "p" with text "К оглавлению"', () => {
        cy.get('a[href*="#/list"]').click();
        cy.get('h3').should('have.text', 'Связный список');
    });
});