import React from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import stringStile from './string.module.css';
import { useState } from "react";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ElementStates } from "../../types/types";
import { DELAY_IN_MS } from "../../constants/delays";
import { updateElementsWithInterval } from "../../utils/utils";
import { getReversingStringSteps } from "./utils";
import { CircleElement } from "../../types/types";
import { useEffect } from "react";

export const StringComponent: React.FC = () => {
  const [inputString, setInputString] = useState('');
  const [inProgress, setInProgress] = useState(false);
  const [letters, setLetters] = useState<(CircleElement | null)[]>([]);
  const [isComponentMounted, setIsMounted] = useState(false);

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

  // Функция разворота строки
  const reversed = async () => {
    setInProgress(true);
    const letters: CircleElement[] = [];
    inputString.split('').forEach((element) => {
      letters.push({ value: element, state: ElementStates.Default });
    });
    const steps = getReversingStringSteps(inputString)
    let currentStep = 0;
    while (currentStep < steps.length) {
      if (steps) {
        let leftIndex = currentStep;
        let rightIndex = letters.length - currentStep - 1;
        
        letters[leftIndex].state = ElementStates.Changing;
        letters[rightIndex].state = ElementStates.Changing;

        await updateElementsWithInterval(setLetters, [...letters], DELAY_IN_MS, isComponentMounted);
        letters[leftIndex].state = ElementStates.Modified;
        letters[rightIndex].state = ElementStates.Modified;

        if (currentStep < steps.length - 1) {
          letters[leftIndex+1].state = ElementStates.Changing;
          letters[rightIndex-1].state = ElementStates.Changing;
        }

        letters[leftIndex].value = steps[currentStep][leftIndex];
        letters[rightIndex].value = steps[currentStep][rightIndex];
        
        await updateElementsWithInterval(setLetters, [...letters], DELAY_IN_MS, isComponentMounted);

        currentStep++;
      }
    }
    setInProgress(false);
  }

  // Функция-обработка кнопки submit
  const handleStringFormSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault();

    reversed();
  }

  return (
    <SolutionLayout title="Строка">

      <form className={stringStile.form} onSubmit={handleStringFormSubmit}>
        <Input 
          maxLength={11} 
          isLimitText={true} 
          limitTexteEnd="ов"
          value={inputString} 
          onChange={handleInputChange} />
        <Button 
          text='Развернуть' 
          type="submit" 
          disabled={!inputString} 
          isLoader={inProgress} />
      </form>

      <ul className={stringStile.circleWrap}>
        {letters.length > 0 && letters.map((letter, index) => (
          <Circle
            state={letter?.state}
            letter={letter?.value.toString()}
            key={index}
          />
        ))}
      </ul>

    </SolutionLayout>
  );
}