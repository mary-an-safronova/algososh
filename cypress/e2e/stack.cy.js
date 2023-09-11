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
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов
        cy.get('input').type(inputText); // текст в инпуте
        cy.get('p').contains('Добавить').parent().click(); // нажимается кнопка 'Добавить'

        cy.get(circleTextEl).parent().should('have.length', 1) // в массив добавляется 1 элемент
            .and('have.css', 'border-color', color.changing).and('have.text', inputText) // имеет цвет изменения и текст инпута
            .wait(SHORT_DELAY_IN_MS) // таймаут
            .should('have.css', 'border-color', color.default).and('have.text', inputText);  // имеет дефолтный цвет и текст инпута
        cy.get(circleHead).should('have.text', 'top').next().next().should('have.text', '0'); // имеет head с текстом 'top' и текст в индексе

        cy.get('input').should('have.value', ''); // инпут пуст
        cy.get('p').contains('Добавить').parent().should('be.disabled'); // кнопка добавления неактивна
        cy.get('p').contains('Удалить').parent().should('not.be.disabled'); // кнопка удаления активна
        cy.get('p').contains('Очистить').parent().should('not.be.disabled'); // кнопка очистки активна

        for (let i = 0; i < 6; i++) {
            cy.get('input').type(inputText); // текст в инпуте
            cy.get('p').contains('Добавить').parent().click(); // нажимается кнопка 'Добавить'
            cy.get(circleHead).should('have.text', 'top') // добавляемый элемент имеет head
                .next().eq(-1).should('have.css', 'border-color', color.changing) // добавляемый элемент имеет цвет изменения
                .and('have.text', inputText).next().should('have.text', i+1) // имеет текст инпута и текст в индексе

            cy.get(circleTextEl).should('have.length', i+2).each(($circle, index) => {
                if (i === index) {
                    cy.wait(SHORT_DELAY_IN_MS) // таймаут
                        .wrap($circle).parent().should('have.css', 'border-color', color.default).and('have.text', inputText); // элемент приобретает дефолтный цвет
                }
            });
            
            cy.get('input').should('have.value', ''); // инпут пуст
            cy.get('p').contains('Добавить').parent().should('be.disabled'); // кнопка добавления неактивна
            cy.get('p').contains('Удалить').parent().should('not.be.disabled'); // кнопка удаления активна
            cy.get('p').contains('Очистить').parent().should('not.be.disabled'); // кнопка очистки активна
        }
    });

    it('should be a correct display of the stack when an element is removed', () => {
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов

        for (let i = 0; i <= 6; i++) { // добавляется максимум элементов
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
            cy.get(circleTextEl).parent().should('have.length', i+1)
            cy.get('p').contains('Добавить').parent().should('be.disabled');
        }

        for (let i = 0; i <= 6; i++) { // проходим по массиву элементов
            cy.get('p').contains('Удалить').parent().should('not.be.disabled').click(); // нажимается кнопка 'Удалить'
            
            if (i < 6) { // удаление всех элементов по очереди, кроме одного
                cy.get(circleHead).should('have.text', 'top').next().eq(-1) // последний элемент в массиве имеет head
                    .should('have.css', 'border-color', color.changing) // имеет цвет изменения
                    .and('have.text', inputText).next().should('have.text', 6-i) // текст из инпута и текст индекса

                cy.get(circleTextEl).parent().should('have.length', 6-i) // длина массива
                cy.wait(SHORT_DELAY_IN_MS) // таймаут

                cy.get(circleHead).should('have.text', 'top').next().eq(-1) // новый последний элемент в массиве имеет head
                    .should('have.css', 'border-color', color.default) // имеет дефолтный цвет
                    .and('have.text', inputText).next().should('have.text', 6-i-1); // текст из инпута и текст индекса
            } else { // удаление последнего оставшегося элемента
                cy.get(circleHead).should('have.text', 'top').next().eq(-1)  // имеет head
                    .should('have.css', 'border-color', color.changing) // имеет цвет изменения
                    .and('have.text', inputText).next().should('have.text', '0'); // текст из инпута и текст индекса
                cy.wait(SHORT_DELAY_IN_MS) // таймаут
                    .get(circleTextEl).parent().should('have.length', 1); // длина массива
            }
        }

        cy.get(circleTextEl).should('have.length', 0); // длина массива
        cy.get('p').contains('Удалить').parent().should('be.disabled'); // кнопка удаления неактивна
        cy.get('p').contains('Очистить').parent().should('be.disabled'); // кнопка очистки неактивна
    });

    it('should be a correct display of the stack when the elements are cleaned', () => {
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов

        for (let i = 0; i <= 6; i++) { // добавляется максимум элементов
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
            cy.get(circleTextEl).parent().should('have.length', i+1)
            cy.get('p').contains('Добавить').parent().should('be.disabled');
        }

        cy.get('p').contains('Очистить').parent().should('not.be.disabled').click(); // нажимается кнопка 'Очистить'
        cy.wait(SHORT_DELAY_IN_MS) // таймаут
            .get(circleTextEl).should('have.length', 0); // длина массива
        cy.get('p').contains('Очистить').parent().should('be.disabled'); // кнопка удаления неактивна
        cy.get('p').contains('Удалить').parent().should('be.disabled'); // кнопка очистки неактивна
    });
})