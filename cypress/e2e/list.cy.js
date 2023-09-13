import { circleTextEl, color, listTextInput, listIndexInput, defaultTextArr } from '../support/constants/constants';
import { SHORT_DELAY_IN_MS } from '../../src/constants/delays';
import { getRandomText } from '../support/utils/utils';

describe('list works correctly', () => {
    beforeEach('should visible the "List" page', () => {
        cy.visit('#/list');
    })

    it('should if the input is empty, then the "add in head" button is disabled', () => {
        cy.get(listTextInput).should('have.value', ''); // инпут текста
        cy.get('p').contains('Добавить в head').parent().should('be.disabled'); 
    });

    it('should if the input is empty, then the "add in tail" button is disabled', () => {
        cy.get(listTextInput).should('have.value', ''); // инпут текста
        cy.get('p').contains('Добавить в tail').parent().should('be.disabled');
    });

    it('should if the input is empty, then the "delete from head" button is disabled', () => {
        cy.get('p').contains('Удалить из head').as('deleteFromHead')

        cy.get('@deleteFromHead').parent().should('not.be.disabled').click().click().click(); // удаляем из списка все элементы, кроме одного
        cy.get(circleTextEl).should('have.length', 1);
        cy.get('@deleteFromHead').parent().should('be.disabled');
    });

    it('should if the input is empty, then the "delete from tail" button is disabled', () => {
        cy.get('p').contains('Удалить из tail').as('deleteFromTail')

        cy.get('@deleteFromTail').parent().should('not.be.disabled').click().click().click(); // удаляем из списка все элементы, кроме одного
        cy.get(circleTextEl).should('have.length', 1);
        cy.get('@deleteFromTail').parent().should('be.disabled');
    });

    it('should if the input is empty, then the "add by index" button is disabled', () => {
        cy.get(listTextInput).should('have.value', ''); // инпут текста
        cy.get(listIndexInput).should('have.value', ''); // инпут индекса
        cy.get('p').contains('Добавить по индексу').parent().should('be.disabled');
    });

    it('should if the input is empty, then the "delete by index" button is disabled', () => {
        cy.get('p').contains('Удалить по индексу').as('deleteByIndexBtn');

        cy.get(listIndexInput).should('have.value', ''); // инпут индекса
        cy.get('@deleteByIndexBtn').parent().should('be.disabled');

        cy.get(listIndexInput).type(3);
        cy.get('@deleteByIndexBtn').parent().should('not.be.disabled').click(); // удаляем по индексу 3

        cy.get(listIndexInput).type(2);
        cy.get('@deleteByIndexBtn').parent().should('not.be.disabled').click(); // удаляем по индексу 2

        cy.get(listIndexInput).type(1);
        cy.get('@deleteByIndexBtn').parent().should('not.be.disabled').click(); // удаляем по индексу 1

        cy.get(circleTextEl).should('have.length', 1); // остается один компонент circle
        cy.get(listIndexInput).type(0); // вводим данные инпут индекса
        cy.get('@deleteByIndexBtn').parent().should('be.disabled'); // последний компонент circle удалить нельзя
    });

    it('should check the correctness of rendering the default list', () => {
        for (let i = 0; i < defaultTextArr.length; i++) {
            if (i === 0) {
                cy.get(circleTextEl).parent().eq(i).should('have.css', 'border-color', color.default).and('have.text', defaultTextArr[i]) // первый компонент circle
                    .prev().should('have.text', 'head') // имеет head
                    .next().next().should('have.text', i) // надпись в индекс
                    .parent().next().should('be.exist'); // имеет стрелку справа
            } else if (i === 3) {
                cy.get(circleTextEl).parent().eq(i).should('have.css', 'border-color', color.default).and('have.text', defaultTextArr[i]) // последний компонент circle
                    .prev().should('have.text', '') // не имеет head
                    .next().next().should('have.text', i) // надпись в индекс
                    .parent().next().should('not.be.exist'); // не имеет стрелку справа
            } else {
                cy.get(circleTextEl).parent().eq(i).should('have.css', 'border-color', color.default).and('have.text', defaultTextArr[i])  // остальные компоненты circle
                    .prev().should('have.text', '') // не имеют head
                    .next().next().should('have.text', i) // надпись в индекс
                    .parent().next().should('be.exist'); // имеют стрелку справа
            }
        }
    })

    it('should check the correctness of added the element in head', () => {
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов

        cy.get(listTextInput).type(inputText); // помещаем текст в инпут текста
        cy.get('p').contains('Добавить в head').parent().click(); // нажимаем на 'Добавить в head'

        cy.get(circleTextEl).eq(1).parent().should('have.css', 'border-color', color.default) //первый элемент в списке
            .prev().should('have.text', '') // надпись head
            .next().next().should('have.text', 0) // надпись в index
            .parent().prev().children().children().should('have.text', inputText) // кружок наверху с текстом
            .parent().should('be.exist').and('have.css', 'border-color', color.changing).and('have.css', 'width', '56px') // кружок наверху цвета изменения, маленького размера

        cy.wait(SHORT_DELAY_IN_MS).then(() => {}).get(circleTextEl).eq(0).parent() //новый первый элемент в списке
            .should('have.css', 'border-color', color.modified).and('have.text', inputText) // цвета модификации с текстом из инпута
            .wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
            .should('have.css', 'border-color', color.default) //новый первый элемент в списке дефолтного цвета
            .prev().should('have.text', 'head') // надпись head нового первого элемента в списке
            .parent().next().should('be.exist') // стрелка справа от добавленного элемента

        cy.get(circleTextEl).eq(1).parent().should('have.css', 'border-color', color.default) //второй элемент в списке
        .prev().should('have.text', '') // надпись head
        .next().next().should('have.text', 1) // надпись в index
    })

    it('should check the correctness of added the element in tail', () => {
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов

        cy.get(listTextInput).type(inputText); // помещаем текст в инпут текста
        cy.get('p').contains('Добавить в tail').parent().click(); // нажимаем на 'Добавить в tail'

        cy.get(circleTextEl).eq(3).parent().should('be.exist') // кружок наверху последнего элемента в списке
            .and('have.css', 'border-color', color.changing).and('have.text', inputText).and('have.css', 'width', '56px') // имеет цвет изменения, текст из инпута и маленький размер
            .parent().next().children().children().parent().prev().should('have.text', '') // надпись head
            .next().next().should('have.text', '3') // надпись в index
            .next().should('have.text', '') // надпись tail

        cy.wait(SHORT_DELAY_IN_MS).then(() => {}).get(circleTextEl).eq(4).parent() // новый последний элемент в списке
            .should('have.css', 'border-color', color.modified).and('have.text', inputText) // цвета модификации с текстом из инпута
            .wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
            .should('have.css', 'border-color', color.default) //новый первый элемент в списке дефолтного цвета
            .next().next().should('have.text', 'tail') // надпись tail
            .prev().prev().prev().should('have.text', '') // надпись head
            .next().next().should('have.text', 4) // надпись в index
            .parent().next().should('not.be.exist') // стрелка справа от добавленного элемента

        cy.get(circleTextEl).eq(3).parent().should('have.css', 'border-color', color.default) //второй элемент в списке
        .prev().should('have.text', '') // надпись head
        .next().next().should('have.text', 3) // надпись в index
        .parent().next().should('be.exist') // стрелка справа от добавленного элемента
    })

    it('should check the correctness of added the element by index', () => {
        let inputText = getRandomText(4); // генерация рандомного текста из 4 символов
        let inputIndexNumber = 2; // номер индекса

        cy.get(listTextInput).type(inputText); // помещаем текст в инпут текста
        cy.get(listIndexInput).type(inputIndexNumber); // помещаем номер индекса в инпут индекса
        cy.get('p').contains('Добавить по индексу').parent().click(); // нажимаем на 'Добавить по индексу'

        cy.get(circleTextEl).eq(0).parent().should('be.exist') // кружок наверху
            .and('have.css', 'border-color', color.changing).and('have.text', inputText).and('have.css', 'width', '56px') // имеет цвет изменения, текст из инпута и маленький размер
            .parent().next().children().children().parent().prev().should('have.text', '') // надпись head
            .next().should('have.css', 'border-color', color.changing) // основной круг цвета изменения
            .next().should('have.text', 0) // надпись в index
            .parent().next().should('be.exist') // стрелка справа от основного круга
            .children().children().should('have.attr', 'fill', "#d252e1") // стрелка имеет цвет изменения

        cy.wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
            .get(circleTextEl).eq(1).parent().should('be.exist') // кружок наверху
            .and('have.css', 'border-color', color.changing).and('have.text', inputText).and('have.css', 'width', '56px') // имеет цвет изменения, текст из инпута и маленький размер
            .parent().next().children().children().parent().prev().should('have.text', '') // надпись head
            .next().should('have.css', 'border-color', color.changing) // основной круг цвета изменения
            .next().should('have.text', 1) // надпись в index
            .parent().next().should('be.exist') // стрелка справа от основного круга
            .children().children().should('have.attr', 'fill', "#d252e1") // стрелка имеет цвет изменения

        cy.wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
            .get(circleTextEl).eq(2).parent().should('have.css', 'border-color', color.modified) // основной круг добаленного элемента цвета изменения
            .and('have.text', inputText) // имеет текст из инпута
            .next().should('have.text', 2) // надпись в index
            .parent().next().should('be.exist') // стрелка справа от основного круга
            .children().children().should('have.attr', 'fill', '#0032ff') // стрелка имеет дефолтный цвет
            .parent().parent().prev().parent().next().children().children().eq(1) // основной круг соседнего справа элемента
            .should('have.css', 'border-color', color.changing) // принимает цвет изменения
            .next().should('have.text', 3) // надпись в его index меняется на следуюший index
            .parent().next().should('be.exist') // его стрелка справа
            .children().children().should('have.attr', 'fill', "#d252e1") // стрелка имеет цвет изменения

        cy.wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
            .get(circleTextEl).parent().each(($circle, index) => {
                if (index === 0) {  // первый компонент circle
                    cy.wrap($circle).should('have.css', 'border-color', color.default) // каждый основной круг принимает дефолтный цвет
                        .prev().should('have.text', 'head') // надпись head
                        .next().next().should('have.text', index) // надпись в index
                        .parent().next().should('be.exist') // стрелка справа от основного круга
                        .children().children().should('have.attr', 'fill', '#0032ff') // стрелка имеет дефолтный цвет
                } else if (index === 4) {  // последний компонент circle
                    cy.wrap($circle).should('have.css', 'border-color', color.default) // каждый основной круг принимает дефолтный цвет
                        .prev().should('have.text', '') // не надпись head
                        .next().next().should('have.text', index) // надпись в index
                        .next().should('have.text', 'tail') // надпись tail
                        .parent().next().should('not.be.exist') // стрелка справа от основного круга
                } else {  // остальные компоненты circle
                    cy.wrap($circle).should('have.css', 'border-color', color.default) // каждый основной круг принимает дефолтный цвет
                        .prev().should('have.text', '') // не надпись head
                        .next().next().should('have.text', index) // надпись в index
                        .parent().next().should('be.exist') // стрелка справа от основного круга
                        .children().children().should('have.attr', 'fill', '#0032ff') // стрелка имеет дефолтный цвет
                }
            })
    })

    it('should check the correctness of deleted the element from head', () => {
        cy.get('p').contains('Удалить из head').parent().should('not.be.disabled').click(); // нажимаем на 'Удалить из head'

        cy.get(circleTextEl).parent().eq(0) // первый компонент circle
            .should('have.css', 'border-color', color.default) // имеет дефолтный цвет
            .and('have.text', '') // не имеет текста внутри основного круга
            .prev().should('have.text', 'head') // имеет head
            .next().next().should('have.text', 0) // надпись в индекс
            .parent().next().children().eq(1).should('be.exist') // малый круг под основным
            .and('have.css', 'border-color', color.changing) // имеет цвет изменения
            .and('have.text', defaultTextArr[0]) // имеет текст
            .wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут

        cy.wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
            .get(circleTextEl).parent().eq(0) // новый первый компонент circle
            .should('have.css', 'border-color', color.default) // имеет дефолтный цвет
            .and('have.text', defaultTextArr[1]) // имеет текста внутри основного круга
            .prev().should('have.text', 'head') // имеет head
            .next().next().should('have.text', 0) // надпись в индекс
            .parent().next().should('be.exist') // имеет стрелку справа
    })

    it('should check the correctness of deleted the element from tail', () => {
        cy.get('p').contains('Удалить из tail').parent().should('not.be.disabled').click(); // нажимаем на 'Удалить из tail'

        cy.get(circleTextEl).parent().eq(3) // последний компонент circle
            .should('have.css', 'border-color', color.default) // имеет дефолтный цвет
            .and('have.text', '') // не имеет текста внутри основного круга
            .next().next().should('have.text', '') // имеет tail
            .prev().prev().prev().should('have.text', '') // не имеет head
            .next().next().should('have.text', 3) // надпись в индекс
            .parent().next().children().eq(1).should('be.exist') // малый круг под основным
            .and('have.css', 'border-color', color.changing) // имеет цвет изменения
            .and('have.text', defaultTextArr[3]) // имеет текст
            .wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут

        cy.wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
            .get(circleTextEl).parent().eq(2) // новый последний компонент circle
            .should('have.css', 'border-color', color.default) // имеет дефолтный цвет
            .and('have.text', defaultTextArr[2]) // имеет текст внутри основного круга
            .next().next().should('have.text', 'tail') // имеет tail
            .prev().prev().prev().should('have.text', '') // не имеет head
            .next().next().should('have.text', 2) // надпись в индекс
            .parent().next().should('not.be.exist') // не имеет стрелку справа
    })

    it('should check the correctness of deleted the element by index', () => {
        let inputIndexNumber = 2; // номер индекса
        cy.get(listIndexInput).type(inputIndexNumber); // помещаем номер индекса в инпут индекса
        cy.get('p').contains('Удалить по индексу').parent().should('not.be.disabled').click(); // нажимаем на 'Удалить по индексу'

        cy.get(circleTextEl).parent().should('have.length', defaultTextArr.length) // длина массива элементов

        for (let i = 0; i <= inputIndexNumber; i++) {
            if (i === 0) {
                cy.get(circleTextEl).eq(i).parent() // первый основной круг
                    .should('have.css', 'border-color', color.changing).and('have.text', defaultTextArr[i]) // имеет цвет изменения и дефолтный текст
                    .prev().should('have.text', 'head') // имеет надпись head
                    .next().next().should('have.text', i) // надпись в index
                    .parent().next().should('be.exist') // стрелка справа от основного круга
                    .children().children().should('have.attr', 'fill', "#d252e1") // стрелка имеет цвет изменения
            } else if (i === inputIndexNumber) {
                cy.get(circleTextEl).eq(i).parent() // удаляемый основной круг
                    .should('have.css', 'border-color', color.changing).and('have.text', defaultTextArr[i]) // имеет цвет изменения и дефолтный текст
                    .prev().should('have.text', '') // не имеет надпись head
                    .next().next().should('have.text', i) // надпись в index
                    .parent().next().should('be.exist') // стрелка справа от основного круга
                    .children().children().should('have.attr', 'fill', "#d252e1") // стрелка имеет цвет изменения
                    .wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
                    .parent().parent().prev().prev().children().eq(1) // основной круг удаляемого элемента
                    .should('have.css', 'border-color', color.changing).and('have.text', '') // имеет цвет изменения и не имеет текста
                    .parent().next().children().eq(1) // малый круг снизу от удаляемого элемента
                    .should('have.css', 'border-color', color.changing).and('have.text', defaultTextArr[i]) // имеет цвет изменения и дефолтный текст
            } else {
                cy.get(circleTextEl).eq(i).parent() // промежуточный основной круг
                    .should('have.css', 'border-color', color.changing).and('have.text', defaultTextArr[i]) // имеет цвет изменения и дефолтный текст
                    .wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
                    .should('have.css', 'border-color', color.default)
            }
        }

        defaultTextArr.splice(inputIndexNumber, 1) // дефолтный массив элементов без удаленного элемента

        cy.wait(SHORT_DELAY_IN_MS).then(() => {}) // таймаут
            .get(circleTextEl).parent().should('have.length', defaultTextArr.length) // длина массива элементов
            .each(($circle, index) => { // перебираем массив
                if (index === 0) {
                    cy.wrap($circle) // основной круг
                        .should('have.css', 'border-color', color.default).and('have.text', defaultTextArr[index]) // имеет дефолтный цвет и дефолтный текст
                        .prev().should('have.text', 'head') // имеет надпись head
                        .next().next().should('have.text', index) // надпись в index
                        .parent().next().should('be.exist') // имеет стрелку справа от основного круга
                        .children().children().should('have.attr', 'fill', "#0032ff") // стрелка имеет дефолтный цвет
                } else if (index === defaultTextArr.length-1) {
                    cy.wrap($circle) // основной круг
                        .should('have.css', 'border-color', color.default).and('have.text', defaultTextArr[index]) // имеет дефолтный цвет и дефолтный текст
                        .prev().should('have.text', '') // не имеет надпись head
                        .next().next().should('have.text', index) // надпись в index
                        .next().should('have.text', 'tail') // имеет надпись tail
                        .parent().next().should('not.be.exist') // имеет стрелку справа от основного круга
                } else {
                    cy.wrap($circle) // основной круг
                        .should('have.css', 'border-color', color.default).and('have.text', defaultTextArr[index]) // имеет дефолтный цвет и дефолтный текст
                        .prev().should('have.text', '') // не имеет надпись head
                        .next().next().should('have.text', index) // надпись в index
                        .next().should('have.text', '') // не имеет надпись tail
                        .parent().next().should('be.exist') // имеет стрелку справа от основного круга
                        .children().children().should('have.attr', 'fill', "#0032ff") // стрелка имеет дефолтный цвет
                }
            })
    })
})