import React, { useState, useMemo, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import listPageStyle from './list-page.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { Position, ElementStates, ListCircleElement, Colors } from "../../types/types"; 
import { LinkedList } from "./list";
import { updateWithInterval } from "../../utils/utils";

export const ListPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputIndexValue, setInputIndexValue] = useState<string | number>('');
  const [listLetters, setListLetters] = useState<ListCircleElement[]>([]);
  const [inProgressAddInHead, setInProgressAddInHead] = useState(false);
  const [inProgressAddInTail, setInProgressAddInTail] = useState(false);
  const [inProgressDeleteInHead, setInProgressDeleteInHead] = useState(false);
  const [inProgressDeleteInTail, setInProgressDeleteInTail] = useState(false);
  const [inProgressAddByIndex, setInProgressAddByIndex] = useState(false);
  const [inProgressDeleteByIndex, setInProgressDeleteByIndex] = useState(false);
  const [isComponentMounted, setIsMounted] = useState(false);

  let inputNumber = Number(inputIndexValue)

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
}, []);

  // Создание и отображение дефолтного массива
  const initialArr = useMemo(() => ['0', '34', '8', '1'], []);
  const list = useMemo(() => new LinkedList<string | number>(initialArr), [initialArr]);

  useEffect(() => {
    const newListLetters = initialArr.map((element, index) => {
      const circleElement: ListCircleElement = { value: element, state: ElementStates.Default, head: index === 0, tail: index === initialArr.length - 1, arrow: index !== initialArr.length - 1 };
      return circleElement;
    });
    setListLetters(newListLetters);
  }, [initialArr]);

  const handleInputValueChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const newInputString = evt.currentTarget.value;
    setInputValue(newInputString);
  };

  const handleInputIndexChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const newInputString = parseInt(evt.currentTarget.value);
    setInputIndexValue(newInputString);
  };

  // Добавление нового элемента в head
  const handleAddInHead = async () => {
    setInProgressAddInHead(true);

    listLetters[0] = { ...listLetters[0], head: false, arrow: true, positionToChange: true, valueToChange: inputValue }; // отображение маленького кружка с добавляемым значением
    await updateWithInterval(setListLetters, [...listLetters], SHORT_DELAY_IN_MS, isComponentMounted); 
  
    listLetters[0].positionToChange = false; // скрытие маленького кружка с добавляемым значением
    list.prepend(inputValue); 
    const head = list.getNodeByIndex(0); 
    listLetters.unshift({ value: head ? head : '', state: ElementStates.Modified, head: true, tail: false, arrow: true }); // добавление элемента и выделение большого круга зеленым цветом
    setListLetters(listLetters); 
    listLetters[0].state = ElementStates.Default;  // выделение большого круга дефолтным цветом
    await updateWithInterval(setListLetters, [...listLetters], SHORT_DELAY_IN_MS, isComponentMounted); 

    setInputIndexValue(''); 
    setInputValue('');
    setInProgressAddInHead(false);
  }

  // Добавление нового элемента в tail
  const handleAddInTail = async () => {
    setInProgressAddInTail(true);

    let tailIndex = list.getSize() - 1; 
    listLetters[tailIndex] = { ...listLetters[tailIndex], tail: false, positionToChange: true, valueToChange: inputValue }; // отображение маленького кружка с добавляемым значением
    await updateWithInterval(setListLetters, listLetters, SHORT_DELAY_IN_MS, isComponentMounted); 
   
    listLetters[tailIndex] = { ...listLetters[tailIndex], positionToChange: false, arrow: true }; // скрытие маленького кружка, добавление стрелки
    list.append(inputValue); 
    listLetters.push({ value: inputValue, state: ElementStates.Modified, tail: true, arrow: false }); // добавление элемента и выделение большого круга зеленым цветом
    setListLetters(listLetters); 
    await updateWithInterval(setListLetters, listLetters, SHORT_DELAY_IN_MS, isComponentMounted); 
   
    tailIndex = list.getSize() - 1;
    listLetters[tailIndex].state = ElementStates.Default; // выделение большого круга дефолтным цветом

    setInputIndexValue('');
    setInputValue('');
    setInProgressAddInTail(false);
  }

  // Удаление элемента из head
  const handleDeleteInHead = async () => {
    setInProgressDeleteInHead(true);
    
    listLetters[0] = { ...listLetters[0], positionToChange: true, valueToChange: listLetters[0].value, value: '' }; // отображение маленького кружка с удаляемым значением
    await updateWithInterval(setListLetters, listLetters, SHORT_DELAY_IN_MS, isComponentMounted);

    listLetters[0].positionToChange = false;
    list.deleteHead();
    listLetters.shift(); // удаление элемента из head
    listLetters[0].head = true;
    await updateWithInterval(setListLetters, listLetters, SHORT_DELAY_IN_MS, isComponentMounted);

    setInputIndexValue('');
    setInputValue('');
    setInProgressDeleteInHead(false);
  }

  // Удаление элемента из tail
  const handleDeleteInTail = async () => {
    setInProgressDeleteInTail(true);

    const newListLetters = [...listLetters];  
    let lastLetter = newListLetters[list.getSize() - 1]; 
    lastLetter.positionToChange = true;  // отображение маленького кружка с удаляемым значением
    lastLetter.valueToChange = lastLetter.value;  
    lastLetter.value = '';  
    lastLetter.tail = false;  
    await updateWithInterval(setListLetters, newListLetters, SHORT_DELAY_IN_MS, isComponentMounted);  
  
    lastLetter.positionToChange = false;  // скрытие маленького кружка с удаляемым значением
    list.deleteTail();  
    newListLetters.pop();  // Удаление элемента из tail
    lastLetter = newListLetters[list.getSize() - 1]; 
    lastLetter.tail = true;  // добавление надписи tail предыдущему элементу
    lastLetter.arrow = false;  // удаление стрелки у предыдущего элемента
    await updateWithInterval(setListLetters, newListLetters, SHORT_DELAY_IN_MS, isComponentMounted);

    setInputIndexValue('');
    setInputValue('');
    setInProgressDeleteInTail(false);
  }

  // Добавление элемента по индексу
  const handleAddByIndex = async () => {
    setInProgressAddByIndex(true);
    
    list.addByIndex(inputNumber, inputValue); 
    for (let i = 0; i <= inputNumber; i++) { // проход по массиву элементов
      listLetters[i] = { ...listLetters[i], state: ElementStates.Changing, positionToChange: true, valueToChange: inputValue, head: false }; // отображение маленького кружка с добавляемым значением
      await updateWithInterval(setListLetters, [...listLetters], SHORT_DELAY_IN_MS, isComponentMounted); 
      listLetters[i].positionToChange = false; // скрытие маленького кружка с добавляемым значением
      if (inputIndexValue !== 0) listLetters[0].head = true; 
    } 
    const insertedNode = list.getNodeByIndex(inputNumber); // получение элемента по индексу
    listLetters.splice(inputNumber, 0, { value: insertedNode ? insertedNode : '', state: ElementStates.Modified, arrow: true }); // добавление элемента в массив, выделение большого круга зеленым цветом
    listLetters[0].head = true; 
    listLetters[list.getSize() - 1].tail = true; 
    setListLetters([...listLetters]); 
    for (let i = 0; i <= inputNumber + 1; i++) listLetters[i].state = ElementStates.Default; // выделение большого добавленного круга дефолтным цветом
    await updateWithInterval(setListLetters, [...listLetters], SHORT_DELAY_IN_MS, isComponentMounted); 

    setInputIndexValue('');
    setInputValue('');
    setInProgressAddByIndex(false);
  }

  // Удаление элемента по индексу
  const handleDeleteByIndex = async () => {
    setInProgressDeleteByIndex(true);

    list.deleteByIndex(inputNumber); 
    for (let i = 0; i <= inputNumber; i++) { // проход по массиву элементов
      listLetters[i] = { ...listLetters[i], state: ElementStates.Changing, positionToChange: false, tail: false };  // выделение больших искомых кругов розовым цветом
      setListLetters([...listLetters]); 
      if (i === inputIndexValue) { // отображение у найденного по индексу элемента маленького кружка со значением удаляемого элемента
        const value = listLetters[i].value; 
        listLetters[i] = { ...listLetters[i], value: '', positionToChange: true, valueToChange: value }; 
        await updateWithInterval(setListLetters, [...listLetters], SHORT_DELAY_IN_MS, isComponentMounted); 
      } 
      if (listLetters[i] === listLetters[0]) { 
        listLetters[i].state = ElementStates.Changing; // в процессе поиска красим первый элемент массива в розовый цвет
      } else {
        listLetters[0].state = ElementStates.Changing; // в процессе поиска красим первый элемент массива в розовый цвет
        listLetters[i] = { ...listLetters[i], state: ElementStates.Default }; // в процессе поиска красим в розовый цвет тот элемент массива, по которому проходим в цикле
      }
      await updateWithInterval(setListLetters, [...listLetters], SHORT_DELAY_IN_MS, isComponentMounted); 
      
      listLetters[i] = { ...listLetters[i], positionToChange: false }; // скрытие маленького кружка с удаляемым значением
      setListLetters([...listLetters]); 
    } 
    listLetters.splice(inputNumber, 1); // удаление элемента из массива по индексу
    listLetters[0] = { ...listLetters[0], head: true }; 
    listLetters[list.getSize() - 1] = { ...listLetters[list.getSize() - 1], tail: true, arrow: false }; 
    setListLetters([...listLetters]); 
    for (let i = 0; i < inputNumber; i++) listLetters[i].state = ElementStates.Default; // придание дефолтного цвета всем элементам массива

    setInputIndexValue('');
    setInputValue('');
    setInProgressDeleteByIndex(false);
  }

  return (
    <SolutionLayout title="Связный список">
      <div className={listPageStyle.mainWrap}>
        <div className={listPageStyle.wrap}>
          <Input 
            data-testid='list-text-input'
            maxLength={4} 
            isLimitText={true} 
            limitTexteEnd="а"
            value={inputValue} 
            onChange={handleInputValueChange} 
            disabled={inProgressAddInHead || inProgressAddInTail || inProgressDeleteInHead || inProgressDeleteInTail || inProgressAddByIndex || inProgressDeleteByIndex}
            extraClass={listPageStyle.input}
            placeholder="Введите значение"
          />
          <Button 
            extraClass={listPageStyle.miniBtn}
            text='Добавить&#160;в&#160;head'
            onClick={handleAddInHead} 
            type="button"
            isLoader={inProgressAddInHead} 
            disabled={!inputValue || inProgressAddInTail || inProgressDeleteInHead || inProgressDeleteInTail || inProgressAddByIndex || inProgressDeleteByIndex || list.getSize() > 8}
          />
          <Button 
            extraClass={listPageStyle.miniBtn}
            text="Добавить в tail" 
            onClick={handleAddInTail} 
            type="button"
            isLoader={inProgressAddInTail} 
            disabled={!inputValue || inProgressAddInHead || inProgressDeleteInHead || inProgressDeleteInTail || inProgressAddByIndex || inProgressDeleteByIndex || list.getSize() > 8}
          />
          <Button 
            text="Удалить&#160;из&#160;head" 
            onClick={handleDeleteInHead} 
            type="button"
            isLoader={inProgressDeleteInHead} 
            disabled={inProgressAddInHead || inProgressAddInTail || inProgressDeleteInTail || inProgressAddByIndex || inProgressDeleteByIndex || list.getSize() === 1}
          />
          <Button 
            extraClass={listPageStyle.miniBtn}
            text="Удалить из tail" 
            onClick={handleDeleteInTail} 
            type="button"
            isLoader={inProgressDeleteInTail} 
            disabled={inProgressAddInHead || inProgressAddInTail || inProgressDeleteInHead || inProgressAddByIndex || inProgressDeleteByIndex || list.getSize() === 1}
          />
        </div>
        <div className={listPageStyle.wrap}>
          <Input 
              data-testid='list-index-input'
              maxLength={1} 
              min={0}
              max={list.toArray().length - 1}
              isLimitText={false} 
              value={inputIndexValue} 
              onChange={handleInputIndexChange} 
              disabled={inProgressAddInHead || inProgressAddInTail || inProgressDeleteInHead || inProgressDeleteInTail || inProgressAddByIndex || inProgressDeleteByIndex}
              extraClass={listPageStyle.input}
              placeholder="Введите индекс" 
              type="number"
            />
            <Button 
              extraClass={listPageStyle.btn}
              text="Добавить по индексу" 
              onClick={handleAddByIndex} 
              type="button"
              isLoader={inProgressAddByIndex} 
              disabled={!inputIndexValue || !inputValue || inProgressAddInHead || inProgressAddInTail || inProgressDeleteInHead || inProgressDeleteInTail || inProgressDeleteByIndex 
                || list.getSize() > 8 || Number(inputIndexValue) < 0 || Number(inputIndexValue) > list.getSize() -1}
            />
            <Button 
              extraClass={listPageStyle.btn}
              text="Удалить по индексу" 
              onClick={handleDeleteByIndex} 
              type="button"
              isLoader={inProgressDeleteByIndex} 
              disabled={!inputIndexValue || inProgressAddInHead || inProgressAddInTail || inProgressDeleteInHead || inProgressDeleteInTail || inProgressAddByIndex || list.getSize() === 1 
                || Number(inputIndexValue) < 0 || Number(inputIndexValue) > list.getSize() -1}
            />
        </div>
      </div>
      <ul className={listPageStyle.circlesWrap}>
        {listLetters.map((letter, index) => (

          <li className={listPageStyle.circleWrap} key={index}>
            {(inProgressAddInHead || inProgressAddInTail || inProgressAddByIndex) &&
              letter?.positionToChange && (
                <Circle
                  state={ElementStates.Changing}
                  letter={letter?.valueToChange?.toString()}
                  isSmall={true}
                  extraClass={listPageStyle.topCircle}
                />
            )}
            <Circle
              extraClass={listPageStyle.centerCircle}
              state={letter?.state}
              letter={letter?.value.toString()}
              index={index}
              head={letter?.head ? Position.head : ''}
              tail={letter?.tail ? Position.tail : ''}
            />
            {(inProgressDeleteInHead || inProgressDeleteInTail || inProgressDeleteByIndex) &&
              letter?.positionToChange && (
                <Circle
                  state={ElementStates.Changing}
                  letter={letter?.valueToChange?.toString()}
                  isSmall={true}
                  extraClass={listPageStyle.bottomCircle}
                />
            )}
            {letter?.arrow && !letter?.tail && (
              <div className={listPageStyle.arrowIcon}>
                <ArrowIcon
                  fill={letter?.state === ElementStates.Changing ? Colors.Changing : Colors.Default}
                />
              </div>
            )}
          </li>

        ))}
      </ul>
      
    </SolutionLayout>
  );
};
