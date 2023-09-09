import { circleTextEl, circleHead, color } from '../support/constants/constants';
import { SHORT_DELAY_IN_MS } from '../../src/constants/delays';
import { getRandomText } from '../support/utils/utils';

describe('stack works correctly', () => {
    beforeEach('should visible the "Stack" page', () => {
        cy.visit('#/stack');
    });

    it('should if the input is empty, then the add button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get('p').contains('Добавить').parent().should('be.disabled');
    });

    it('should if the input is empty, then the delete button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get(circleTextEl).should('have.length', 0);
        cy.get('p').contains('Удалить').parent().should('be.disabled');
    });

    it('should if the input is empty, then the clean button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get(circleTextEl).should('have.length', 0);
        cy.get('p').contains('Очистить').parent().should('be.disabled');
    });

    it('should be a correct display of the stack when an element is added', () => {
        let inputText = getRandomText(4);
        cy.get('input').type(inputText);
        cy.get('p').contains('Добавить').parent().click();

        cy.get(circleTextEl).parent().should('have.length', 1).and('have.css', 'border-color', color.changing).and('have.text', inputText)
        .wait(SHORT_DELAY_IN_MS).then(() => {}).should('have.css', 'border-color', color.default).and('have.text', inputText);
        cy.get(circleHead).should('have.text', 'top').next().next().should('have.text', '0');

        cy.get('input').should('have.value', '');
        cy.get('p').contains('Добавить').parent().should('be.disabled');
        cy.get('p').contains('Удалить').parent().should('not.be.disabled');
        cy.get('p').contains('Очистить').parent().should('not.be.disabled');

        for (let i = 0; i < 6; i++) {
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
            cy.get(circleHead).should('have.text', 'top').next().eq(-1).should('have.css', 'border-color', color.changing).and('have.text', inputText).next().should('have.text', i+1)

            cy.get(circleTextEl).should('have.length', i+2).each(($circle, index) => {
                if (i === index) {
                    cy.wait(SHORT_DELAY_IN_MS).then(() => {}).wrap($circle).parent().should('have.css', 'border-color', color.default).and('have.text', inputText);
                }
            });
            
            cy.get('input').should('have.value', '');
            cy.get('p').contains('Добавить').parent().should('be.disabled');
            cy.get('p').contains('Удалить').parent().should('not.be.disabled');
            cy.get('p').contains('Очистить').parent().should('not.be.disabled');
        }
    });

    it('should be a correct display of the stack when an element is removed', () => {
        let inputText = getRandomText(4);

        for (let i = 0; i <= 6; i++) {
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
            cy.get(circleTextEl).parent().should('have.length', i+1)
            cy.get('p').contains('Добавить').parent().should('be.disabled');
        }

        for (let i = 0; i <= 6; i++) {
            cy.get('p').contains('Удалить').parent().should('not.be.disabled').click();
            
            if (i < 6) {
                cy.get(circleHead).should('have.text', 'top').next().eq(-1).should('have.css', 'border-color', color.changing).and('have.text', inputText).next().should('have.text', 6-i);
                cy.wait(SHORT_DELAY_IN_MS).then(() => {}).get(circleTextEl).parent().should('have.length', 6-i);
                cy.get(circleHead).should('have.text', 'top').next().eq(-1).should('have.css', 'border-color', color.default).and('have.text', inputText).next().should('have.text', 6-i-1);
            } else {
                cy.get(circleHead).should('have.text', 'top').next().eq(-1).should('have.css', 'border-color', color.changing).and('have.text', inputText).next().should('have.text', '0');
                cy.wait(SHORT_DELAY_IN_MS).then(() => {}).get(circleTextEl).parent().should('have.length', 1);
            }
        }

        cy.get(circleTextEl).should('have.length', 0);
        cy.get('p').contains('Удалить').parent().should('be.disabled');
        cy.get('p').contains('Очистить').parent().should('be.disabled');
    });

    it('should be a correct display of the stack when the elements is cleaned', () => {
        let inputText = getRandomText(4);

        for (let i = 0; i <= 6; i++) {
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
            cy.get(circleTextEl).parent().should('have.length', i+1)
            cy.get('p').contains('Добавить').parent().should('be.disabled');
        }

        cy.get('p').contains('Очистить').parent().should('not.be.disabled').click();
        cy.wait(SHORT_DELAY_IN_MS).then(() => {}).get(circleTextEl).should('have.length', 0);
        cy.get('p').contains('Очистить').parent().should('be.disabled');
        cy.get('p').contains('Удалить').parent().should('be.disabled');
    });
})