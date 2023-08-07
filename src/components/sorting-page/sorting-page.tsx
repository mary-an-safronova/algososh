import React, { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import sortingPageStyle from './sorting-page.module.css';
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { Direction } from '../../types/types';
import { ElementStates, SortingMethod } from "../../types/types";
import { useEffect } from "react";

export const SortingPage: React.FC = () => {

  const [sortingMethod, setSortingMethod] = useState<SortingMethod>(SortingMethod.Selection);
  const [sortingDirection, setSortingDirection] = useState();
  const [columnArray, setColumnArray] = useState<number[]>([]);

  useEffect(() => {
    setColumnArray(createRandomArr());
  }, []);

  const createRandomArr = () => {
    const min = 0;
    const max = 100;
    const minLen = 3;
    const maxLen = 17;
    const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    const arr: number[] = [];

    for (let i = 0; i < length; i++) {
      let num = Math.floor(Math.random() * (max - min + 1));
      arr.push(num);
    }
    return arr;
  };

  const handleAscending = () => {
    console.log('handleAscending');
  }

  const handleDescending = () => {
    console.log('handleDescending');
  }

  const handleCreatingNewArr = () => {
    setColumnArray(createRandomArr());
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={sortingPageStyle.sortingWrap}>
        <div className={sortingPageStyle.radioInputWrap}>
          <RadioInput label='Выбор' value='selection' checked={sortingMethod === SortingMethod.Selection} onChange={() => setSortingMethod(SortingMethod.Selection)} />
          <RadioInput label='Пузырёк' value='bubble' checked={sortingMethod === SortingMethod.Bubble} onChange={() => setSortingMethod(SortingMethod.Bubble)} />
        </div>

        <div className={sortingPageStyle.buttonWrap}>
          <div className={sortingPageStyle.sortingButtonsWrap}>
            <Button text='По возрастанию' sorting={Direction.Ascending} onClick={handleAscending} />
            <Button text='По убыванию'  sorting={Direction.Descending} onClick={handleDescending} />
          </div>
          <Button text='Новый массив' onClick={handleCreatingNewArr} />
        </div>
      </div>

      <div className={sortingPageStyle.columnArrayWrap}>
        {
          columnArray.map((column, index) => {
            return <Column state={ElementStates.Default} index={column} key={index} />
          })
        }
      </div>
    </SolutionLayout>
  );
};
