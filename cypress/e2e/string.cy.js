import { DELAY_IN_MS } from '../../src/constants/delays';
import { circleTextEl, color } from '../support/constants/constants';
import { getRandomText } from '../support/utils/utils';

describe('string works correctly', () => {
    beforeEach('should visible the "String" page', () => {
        cy.visit('#/recursion');
    })

    it('should if the input is empty, then the add button is disabled', () => {
        cy.get('input').should('have.value', '');
        cy.get('button[type="submit"]').should('be.disabled');
    })

    it('should be a correct display of the string reversal, taking into account animation and styles', () => {
        const inputString = getRandomText(6); // генерация рандомного текста
        const steps = [1, 2, 3]; // массив этапов разворота строки
      
        cy.get('input').type(inputString); // помещаем рандомный текст в инпут
        cy.get('button[type="submit"]').click(); // нажимаем кнопку "Развернуть"
      
        cy.get(circleTextEl).should('have.length', inputString.length); // длина массива компонентов circle
      
        for (let i = 0; i < steps.length; i++) { // проходим по этапам разворота строки
            const forwardIndex = steps[i] - 1; // индекс первого элемента разворота 
            const reverseIndex = inputString.length - (steps[i]); // индекс последнего элемента разворота
        
            cy.get(circleTextEl).eq(forwardIndex).parent().should('have.css', 'border-color', color.changing) // имеет цвет изменения
                .and('have.text', inputString[forwardIndex]); // и первоначальный текст
            cy.get(circleTextEl).eq(reverseIndex).parent().should('have.css', 'border-color', color.changing) // имеет цвет изменения
                .and('have.text', inputString[reverseIndex]); // и первоначальный текст
        
            cy.wait(DELAY_IN_MS);
        
            cy.get(circleTextEl).eq(forwardIndex).parent().should('have.css', 'border-color', color.modified) // имеет цвет модифицированного компонента
                .and('have.text', inputString[reverseIndex]); // и измененный текст
            cy.get(circleTextEl).eq(reverseIndex).parent().should('have.css', 'border-color', color.modified) // имеет цвет модифицированного компонента
                .and('have.text', inputString[forwardIndex]); // и измененный текст
        }
    });
})