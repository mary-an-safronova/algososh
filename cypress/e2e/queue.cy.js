import { circleTextEl, color } from '../support/constants/constants';
import { SHORT_DELAY_IN_MS } from '../../src/constants/delays';
import { getRandomText } from '../support/utils/utils';

describe('queue works correctly', () => {
    beforeEach('should visible the "Queue" page', () => {
        cy.visit('#/queue');
    });

    it('should if the input is empty, then the add button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get('p').contains('Добавить').parent().should('be.disabled');
    });

    it('should if the input is empty, then the delete button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get(circleTextEl).should('have.text', '');
        cy.get('p').contains('Удалить').parent().should('be.disabled');
    });

    it('should if the input is empty, then the clean button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get(circleTextEl).parent().prev().should('have.text', '');
        cy.get('p').contains('Очистить').parent().should('be.disabled');
    });

    it('should be a correct display of the queue when an element is added', () => {
        let inputText = getRandomText(4);

        for (let i = 0; i <= 6; i++) {
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();

            if (i === 0) {
                cy.get(circleTextEl).eq(0)
                    .parent().should('have.css', 'border-color', color.changing).and('have.text', inputText)
                    .prev().should('have.text', 'head')
                    .next().next().should('have.text', '0')
                    .next().should('have.text', 'tail')
                    .wait(SHORT_DELAY_IN_MS).then(() => {})
                    .prev().prev().should('have.css', 'border-color', color.default);
            } else {
                cy.get(circleTextEl).eq(i)
                    .parent().should('have.css', 'border-color', color.changing).and('have.text', inputText)
                    .prev().should('have.text', '')
                    .next().next().should('have.text', i)
                    .next().should('have.text', 'tail')
                    .wait(SHORT_DELAY_IN_MS).then(() => {})
                    .prev().prev().should('have.css', 'border-color', color.default);
            }
            

            cy.get('input').should('have.value', '');
            cy.get('p').contains('Добавить').parent().should('be.disabled');
            cy.get('p').contains('Удалить').parent().should('not.be.disabled');
            cy.get('p').contains('Очистить').parent().should('not.be.disabled');
        }
    });

    it('should be a correct display of the queue when an element is removed', () => {
        let inputText = getRandomText(4);

        for (let i = 0; i <= 6; i++) {
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
        }

        for (let i = 0; i <= 6; i++) {
            cy.get('p').contains('Удалить').parent().should('not.be.disabled').click();

            if (i === 6) {
                cy.get(circleTextEl).eq(i)
                    .parent().should('have.css', 'border-color', color.changing).and('have.text', inputText)
                    .prev().should('have.text', 'head')
                    .next().next().should('have.text', i)
                    .next().should('have.text', '')
                    .wait(SHORT_DELAY_IN_MS).then(() => {})
                    .prev().prev().should('have.css', 'border-color', color.default).and('have.text', '')
                    .prev().should('have.text', 'head')
                    .next().next().should('have.text', i)
                    .next().should('have.text', '')

                cy.get('input').should('have.value', '');
                cy.get('p').contains('Добавить').parent().should('be.disabled');
                cy.get('p').contains('Удалить').parent().should('be.disabled');
                cy.get('p').contains('Очистить').parent().should('not.be.disabled');
            } else {
                cy.get(circleTextEl).eq(i)
                    .parent().should('have.css', 'border-color', color.changing).and('have.text', inputText)
                    .prev().should('have.text', 'head')
                    .next().next().should('have.text', i)
                    .next().should('have.text', '')
                    .wait(SHORT_DELAY_IN_MS).then(() => {})
                    .prev().prev().should('have.css', 'border-color', color.default).and('have.text', '')
                    .prev().should('have.text', '')
                    .next().next().should('have.text', i)
                    .next().should('have.text', '')

                cy.get('input').should('have.value', '');
                cy.get('p').contains('Добавить').parent().should('be.disabled');
                cy.get('p').contains('Удалить').parent().should('not.be.disabled');
                cy.get('p').contains('Очистить').parent().should('not.be.disabled');
            }
        }
    })

    it('should be a correct display of the queue when the elements are cleaned', () => {
        let inputText = getRandomText(4);

        for (let i = 0; i <= 6; i++) {
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
        }

        cy.get('p').contains('Очистить').parent().should('not.be.disabled').click();
        cy.wait(SHORT_DELAY_IN_MS).then(() => {}).get(circleTextEl)
            .parent().should('have.css', 'border-color', color.default).and('have.text', '')
            .prev().should('have.text', '')
            .next().next().next().should('have.text', '')

        cy.get('p').contains('Добавить').parent().should('be.disabled');
        cy.get('p').contains('Удалить').parent().should('be.disabled');
        cy.get('p').contains('Очистить').parent().should('be.disabled');
    });
})