import { circleTextEl } from '../support/constants/constants';
import { SHORT_DELAY_IN_MS } from '../../src/constants/delays';

describe('fibonacci works correctly', () => {
    beforeEach('should visible the "Fibonacci" page', () => {
        cy.visit('#/fibonacci');
    })

    it('should if the input is empty, then the add button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get('button[type="submit"]').should('be.disabled');
    })

    it('should be a correct display of the generation of fibonacci numbers', () => {
        const inputNumber = 7;
        const arr = [];

        cy.get('input[type="number"]').type(inputNumber); 
        cy.get('button[type="submit"]').click(); 

        cy.get(circleTextEl).parent().should('have.length', inputNumber + 1);
    
        cy.get(circleTextEl).parent().each(($circle, index) => { 
            if (index <= 1) {
                arr.push(1);
                cy.wait(SHORT_DELAY_IN_MS).then(() => {}).wrap($circle).should('have.text', '1');
            } else {
                arr.push(arr[index -2] + arr[index - 1]);
                cy.wait(SHORT_DELAY_IN_MS).then(() => {}).wrap($circle).should('have.text', arr[index]);
            }
        }); 
    })
})