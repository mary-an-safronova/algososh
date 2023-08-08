import React, { useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import stackPageStyle from './stack-page.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { CircleElement, ElementStates } from "../../types/types";
import { stack } from "./stack";
import { updateElementsWithInterval, sleep } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const StackPage: React.FC = () => {
  const [inputString, setInputString] = useState('');
  const [stackLetters, setStackLetters] = useState<(CircleElement | null)[]>([]);
  const [isComponentMounted, setIsMounted] = useState(false);
  const [inProgressAdd, setInProgressAdd] = useState(false);
  const [inProgressDelete, setInProgressDelete] = useState(false);
  const [inProgressClear, setInProgressClear] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const newInputString = evt.currentTarget.value;
    setInputString(newInputString);
  };

  // Добавление нового элемента в стек
  const handleStackAdd = async () => {
    setInProgressAdd(true);

    if (stack.getSize() <= 6) {
      stack.push({ value: inputString, state: ElementStates.Changing });
      setStackLetters([...stack.getElements()])

      await sleep(SHORT_DELAY_IN_MS)
      const lastElement = stack.peak();
      if (lastElement) lastElement.state = ElementStates.Default;

      setInputString('');
    }
    
    setInProgressAdd(false);
  }

  // Удаление последнего элемента из стека
  const handleDelete = async () => {
    setInProgressDelete(true);

    const lastElement = stack.peak();
    if (lastElement) lastElement.state = ElementStates.Changing;
    await updateElementsWithInterval(setStackLetters, [...stack.getElements()], SHORT_DELAY_IN_MS, isComponentMounted);

    stack.pop();
    await updateElementsWithInterval(setStackLetters, [...stack.getElements()], SHORT_DELAY_IN_MS, isComponentMounted);
    setInProgressDelete(false);
  }

  // Очистка стека
  const handleClearAll = async () => {
    setInProgressClear(true);
    stack.clear();
    await updateElementsWithInterval(setStackLetters, [...stack.getElements()], SHORT_DELAY_IN_MS, isComponentMounted);
    setInProgressClear(false);
  }

  return (
    <SolutionLayout title="Стек">
      <div className={stackPageStyle.wrap}>
        <div className={stackPageStyle.inputButtonsWrap}>
          <Input 
            maxLength={4} 
            isLimitText={true} 
            limitTexteEnd="а"
            value={inputString} 
            onChange={handleInputChange} 
          />
        
          <div className={stackPageStyle.addDeleteButtonsWrap}>
            <Button 
              text="Добавить" 
              onClick={handleStackAdd} 
              type="button"
              isLoader={inProgressAdd} 
              disabled={!inputString || inProgressDelete || inProgressClear || stack.getSize() > 6} 
            />
            <Button 
              text="Удалить" 
              type="button" 
              onClick={handleDelete} 
              isLoader={inProgressDelete} 
              disabled={stack.getSize() === 0 || inProgressAdd || inProgressClear} 
            />
          </div>
        </div>
          <Button 
            text="Очистить" 
            type="button"
            onClick={handleClearAll} 
            isLoader={inProgressClear} 
            disabled={stack.getSize() === 0 || inProgressDelete || inProgressAdd} 
          />
        
      </div>
      <ul className={stackPageStyle.circleWrap}>
        {stackLetters.map((letter, index) => (
          <Circle
            state={letter?.state}
            letter={letter?.value.toString()}
            index={index}
            key={index}
            head={stack.getSize() - 1 === index ? 'top' : ''}
          />
        ))}
      </ul>
      
    </SolutionLayout>
  );
};
