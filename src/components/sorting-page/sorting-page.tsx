import React, { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import sortingPageStyle from "./sorting-page.module.css";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { Direction } from "../../types/types";
import { ElementStates, SortingMethod } from "../../types/types";
import { useEffect } from "react";
import { swap } from "../../utils/utils";
import { updateColumnElementsWithInterval } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ColumnElement } from "../../types/types";
import { sleep } from "../../utils/utils";

export const SortingPage: React.FC = () => {
  const [sortingMethod, setSortingMethod] = useState<SortingMethod>(SortingMethod.Selection);
  // const [sortingDirection, setSortingDirection] = useState<Direction>(Direction.Ascending);
  const [columnArray, setColumnArray] = useState<ColumnElement[]>([]);
  const [isComponentMounted, setIsMounted] = useState(false);
  const [inProgressAsc, setInProgressAsc] = useState(false);
  const [inProgressDesc, setInProgressDesc] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    setColumnArray(createRandomArr());
  }, []);

  const createRandomArr = () => {
    const min = 0;
    const max = 100;
    const minLen = 3;
    const maxLen = 17;
    const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    const arr = [];

    for (let i = 0; i < length; i++) {
      let num = Math.floor(Math.random() * (max - min + 1));
      arr.push({ value: num, state: ElementStates.Default })
    }
    return arr;
  };

  const selectionSort = async (arr: ColumnElement[], direction: Direction) => {
    direction === Direction.Ascending ? setInProgressAsc(true) : setInProgressDesc(true);

    for (let i = 0; i < arr.length; i++) {
      let minInd = i;
      arr[minInd].state = ElementStates.Changing

      for (let j = i + 1; j < arr.length; j++) {
        arr[j].state = ElementStates.Changing;
        setColumnArray([...arr]);
        await updateColumnElementsWithInterval(setColumnArray, arr, SHORT_DELAY_IN_MS, isComponentMounted);

        if (
          (direction === Direction.Ascending && arr[j].value < arr[minInd].value) ||
          (direction === Direction.Descending && arr[j].value > arr[minInd].value)
        ) {
          minInd = j;
          arr[j].state = ElementStates.Changing;
          arr[minInd].state = i === minInd ? ElementStates.Changing : ElementStates.Default;
        }

        if (j !== minInd) arr[j].state = ElementStates.Default;
        setColumnArray([...arr]);
      }

      swap(arr, minInd, i);
      arr[minInd].state = ElementStates.Default;
      arr[i].state = ElementStates.Modified;
      
      setColumnArray([...arr]);
    }

    direction === Direction.Ascending ? setInProgressAsc(false) : setInProgressDesc(false);
  };

  const handleAscending = () => {
    const newArray = [...columnArray];
    selectionSort(newArray, Direction.Ascending);
  }

  const handleDescending = () => {
    const newArray = [...columnArray];
    selectionSort(newArray, Direction.Descending);
  }

  const handleCreatingNewArr = () => {
    setColumnArray(createRandomArr());
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <div className={sortingPageStyle.sortingWrap}>
        <div className={sortingPageStyle.radioInputWrap}>
          <RadioInput 
            label="Выбор" 
            value="selection" 
            checked={sortingMethod === SortingMethod.Selection} 
            onChange={() => setSortingMethod(SortingMethod.Selection)} 
          />
          <RadioInput 
            label="Пузырёк" 
            value="bubble" 
            checked={sortingMethod === SortingMethod.Bubble} 
            onChange={() => setSortingMethod(SortingMethod.Bubble)} 
          />
        </div>

        <div className={sortingPageStyle.buttonWrap}>
          <div className={sortingPageStyle.sortingButtonsWrap}>
            <Button 
              text="По возрастанию" 
              sorting={Direction.Ascending} 
              onClick={handleAscending} 
              isLoader={inProgressAsc} 
              disabled={inProgressDesc} 
            />
            <Button 
              text="По убыванию"  
              sorting={Direction.Descending} 
              onClick={handleDescending} 
              isLoader={inProgressDesc} 
              disabled={inProgressAsc} 
            />
          </div>
          <Button 
            text="Новый массив" 
            onClick={handleCreatingNewArr} 
            disabled={inProgressAsc || inProgressDesc} 
          />
        </div>
      </div>

      <div className={sortingPageStyle.columnArrayWrap}>
        {
          columnArray.map((column, index) => {
            return <Column index={column.value} state={column?.state} key={index} />
          })
        }
      </div>
    </SolutionLayout>
  );
};
