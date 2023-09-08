import { DELAY_IN_MS } from '../../src/constants/delays';
import { inputString, circleTextEl, color } from '../support/constants/constants';

describe('string works correctly', () => {
    beforeEach('should visible the "String" page', () => {
        cy.visit('#/recursion');
    })

    it('should if the input is empty, then the add button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get('button[type="submit"]').should('be.disabled');
    })
    
    it('should be a correct display of the string reversal, taking into account animation and styles', () => {
        const reverseLetters = (str, first, last) => {
            let arr = str.split('');
            const firstLetter = arr[first - 1];
            const lastLetter = arr[last - 1];
            arr.splice(first-1, 1, lastLetter);
            arr.splice(last-1, 1, firstLetter);
            return arr.join('');
        }

        const oneStepReverseString = reverseLetters(inputString, 1, inputString.length);
        const twoStepReverseString = reverseLetters(oneStepReverseString, 2, inputString.length-1);
        const threeStepReverseString = reverseLetters(twoStepReverseString, 3, inputString.length-2);

        cy.get('input').type(inputString);
        cy.get('button[type="submit"]').click();

        cy.get(circleTextEl).should('have.length', inputString.length);

        cy.wait(DELAY_IN_MS).then(() => {}).get(circleTextEl).parent().each(($circle, index) => {
            if (index === 0 || index === 5) {
                cy.wrap($circle).should('have.css', 'border-color', `${color.modified}`).and('have.text', oneStepReverseString[index]);
            } else if (index === 1 || index === 4) {
                cy.wrap($circle).should('have.css', 'border-color', `${color.changing}`).and('have.text', oneStepReverseString[index]);
            } else {
                cy.wrap($circle).should('have.css', 'border-color', `${color.default}`).and('have.text', oneStepReverseString[index]);
            }
        });

        cy.wait(DELAY_IN_MS).then(() => {}).get(circleTextEl).parent().each(($circle, index) => {
            if (index === 1 || index === 4 || index === 0 || index === 5) {
                cy.wrap($circle).should('have.css', 'border-color', `${color.modified}`).and('have.text', twoStepReverseString[index]);
            } else {
                cy.wrap($circle).should('have.css', 'border-color', `${color.changing}`).and('have.text', twoStepReverseString[index]);
            }
        });

        cy.wait(DELAY_IN_MS).then(() => {}).get(circleTextEl).parent().each(($circle, index) => {
            cy.wrap($circle).should('have.css', 'border-color', `${color.modified}`).and('have.text', threeStepReverseString[index]);
        });
    });
})