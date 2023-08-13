import React from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import fibonacciPageStyle from './fibonacci-page.module.css';
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { useState } from "react";
import { CircleElement } from "../../types/types";
import { useEffect } from "react";
import { ElementStates } from "../../types/types";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { updateElementsWithInterval } from "../../utils/utils";

export const FibonacciPage: React.FC = () => {
  const [number, setNumber] = useState<string>('');
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
    if (!(Number(evt.currentTarget.value) < 0)) {
      return setNumber(evt.currentTarget.value)
    }
  };

  // Функция нахождения числа из последовательности Фибоначчи с помощью мемоизации
  const fib = (n: number, memo: Record<number, number> = {}): number => {
    if (n in memo) {
      return memo[n];
    }
    if (n <= 2) {
      return 1;
    }
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
  };

  // Генерация массива с числами Фибоначчи
  const generateFibonacci = async () => {
    setInProgress(true);

    const inputNumber = Number(number)
    if (inputNumber >= 1 && inputNumber <= 19) {
      const fibonacciNumbers: number[] = [];
      const numbers: CircleElement[] = [];

      for (let i = 1; i <= inputNumber + 1; i++) {
        fibonacciNumbers.push(fib(i));
      }

      for (let i = 0; i < inputNumber + 1; i++) {
        numbers.push({
          value: fibonacciNumbers[i].toString(),
          state: ElementStates.Default,
        });

        await updateElementsWithInterval(
          setLetters,
          numbers,
          SHORT_DELAY_IN_MS,
          isComponentMounted,
        );
      }
      setLetters(numbers);
    }
    setInProgress(false);
  }

  // Функция-обработка кнопки submit
  const handleStringFormSubmit = (evt: React.SyntheticEvent) => {
    evt.preventDefault();
    setLetters([]);

    generateFibonacci();
  }

  return (
    <SolutionLayout title="Последовательность Фибоначчи">

      <form className={fibonacciPageStyle.form} onSubmit={handleStringFormSubmit}>
        <Input 
          type='number'
          maxLength={2}
          max={19}
          min={1}
          isLimitText={true} 
          value={number} 
          onChange={handleInputChange} />
        <Button 
          text='Рассчитать' 
          type="submit" 
          disabled={!number || Number(number) > 19} 
          isLoader={inProgress} />
      </form>

      <ul className={fibonacciPageStyle.circleWrap}>
        {letters && letters.map((letter, index) => (
          <Circle
            state={letter?.state}
            letter={letter?.value.toString()}
            index={index}
            key={index}
          />
        ))}
      </ul>

    </SolutionLayout>
  );
};
