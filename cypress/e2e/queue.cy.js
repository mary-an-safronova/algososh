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
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов

        for (let i = 0; i <= 6; i++) { // проходим по массиву элементов
            cy.get('input').type(inputText); // текст в инпуте
            cy.get('p').contains('Добавить').parent().click(); // нажимается кнопка 'Добавить'

            if (i === 0) {
                cy.get(circleTextEl).eq(0) // первый элемент
                    .parent().should('have.css', 'border-color', color.changing).and('have.text', inputText) // имеет цвет изменения и текст инпута
                    .prev().should('have.text', 'head') // имеет head
                    .next().next().should('have.text', '0') // имеет текст в индексе
                    .next().should('have.text', 'tail') // имеет tail
                    .wait(SHORT_DELAY_IN_MS) // таймаут
                    .prev().prev().should('have.css', 'border-color', color.default); // меняется на дефолтный цвет
            } else {
                cy.get(circleTextEl).eq(i) // остальные элементы
                    .parent().should('have.css', 'border-color', color.changing).and('have.text', inputText) // имеет цвет изменения и текст инпута
                    .prev().should('have.text', '') // не имеет head
                    .next().next().should('have.text', i) // имеет текст в индексе
                    .next().should('have.text', 'tail') // имеет tail
                    .wait(SHORT_DELAY_IN_MS) // таймаут
                    .prev().prev().should('have.css', 'border-color', color.default); // меняется на дефолтный цвет
            }
            

            cy.get('input').should('have.value', ''); // инпут пуст
            cy.get('p').contains('Добавить').parent().should('be.disabled'); // кнопка добавления неактивна
            cy.get('p').contains('Удалить').parent().should('not.be.disabled'); // кнопка удаления активна
            cy.get('p').contains('Очистить').parent().should('not.be.disabled'); // кнопка очистки активна
        }
    });

    it('should be a correct display of the queue when an element is removed', () => {
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов

        for (let i = 0; i <= 6; i++) { // добавляется максимум элементов
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
        }

        for (let i = 0; i <= 6; i++) {  // проходим по массиву элементов
            cy.get('p').contains('Удалить').parent().should('not.be.disabled').click(); // нажимается кнопка 'Удалить'

            if (i === 6) {
                cy.get(circleTextEl).eq(i) // первый элемент
                    .parent().should('have.css', 'border-color', color.changing).and('have.text', inputText) // имеет цвет изменения и текст инпута
                    .prev().should('have.text', 'head') // имеет head
                    .next().next().should('have.text', i) // имеет текст в индексе
                    .next().should('have.text', 'tail') // имеет tail
                    .wait(SHORT_DELAY_IN_MS) // таймаут
                    .prev().prev().should('have.css', 'border-color', color.default).and('have.text', '') // меняется на дефолтный цвет, удаляется текст
                    .prev().should('have.text', 'head') // head остается
                    .next().next().should('have.text', i) // имеет текст в индексе
                    .next().should('have.text', '') // не имеет tail

                cy.get('input').should('have.value', ''); // инпут пуст
                cy.get('p').contains('Добавить').parent().should('be.disabled'); // кнопка добавления неактивна
                cy.get('p').contains('Удалить').parent().should('be.disabled'); // кнопка удаления неактивна
                cy.get('p').contains('Очистить').parent().should('not.be.disabled'); // кнопка очистки активна
            } else {
                cy.get(circleTextEl).eq(i) // остальные элементы
                    .parent().should('have.css', 'border-color', color.changing).and('have.text', inputText) // имеет цвет изменения и текст инпута
                    .prev().should('have.text', 'head') // имеет head
                    .next().next().should('have.text', i) // имеет текст в индексе
                    .next().should('have.text', '')
                    .wait(SHORT_DELAY_IN_MS) // таймаут
                    .prev().prev().should('have.css', 'border-color', color.default).and('have.text', '')
                    .prev().should('have.text', '') // не имеет head
                    .next().next().should('have.text', i) // имеет текст в индексе
                    .next().should('have.text', '') // не имеет tail

                cy.get('input').should('have.value', ''); // инпут пуст
                cy.get('p').contains('Добавить').parent().should('be.disabled'); // кнопка добавления неактивна
                cy.get('p').contains('Удалить').parent().should('not.be.disabled'); // кнопка удаления активна
                cy.get('p').contains('Очистить').parent().should('not.be.disabled'); // кнопка очистки активна
            }
        }
    })

    it('should be a correct display of the queue when the elements are cleaned', () => {
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов

        for (let i = 0; i <= 6; i++) { // добавляется максимум элементов
            cy.get('input').type(inputText);
            cy.get('p').contains('Добавить').parent().click();
        }

        cy.get('p').contains('Очистить').parent().should('not.be.disabled').click(); // нажимается кнопка 'Очистить'
        cy.wait(SHORT_DELAY_IN_MS) // таймаут
            .get(circleTextEl).parent().should('have.css', 'border-color', color.default).and('have.text', '') // элементы имеют дефолтный цвет, удаляется текст
            .prev().should('have.text', '') // удаляется head
            .next().next().next().should('have.text', '') // удаляется tail

        cy.get('p').contains('Добавить').parent().should('be.disabled'); // кнопка добавления неактивна
        cy.get('p').contains('Удалить').parent().should('be.disabled'); // кнопка удаления неактивна
        cy.get('p').contains('Очистить').parent().should('be.disabled'); // кнопка очистки неактивна
    });
})