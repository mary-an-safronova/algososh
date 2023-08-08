import React, { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import sortingPageStyle from "./sorting-page.module.css";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { ElementStates, SortingMethod, ColumnElement, Direction } from "../../types/types";
import { useEffect } from "react";
import { swap, updateColumnElementsWithInterval } from "../../utils/utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const SortingPage: React.FC = () => {
  const [sortingMethod, setSortingMethod] = useState<SortingMethod>(SortingMethod.Selection);
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

  // Генерация рандомного массива при загрузке страницы
  useEffect(() => {
    setColumnArray(createRandomArr());
  }, []);

  // Функция генерации нового массива
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

  // Функция метода сортировки выбором
  const selectionSort = async (arr: ColumnElement[], direction: Direction) => {
    direction === Direction.Ascending ? setInProgressAsc(true) : setInProgressDesc(true);

    for (let i = 0; i < arr.length; i++) {
      let minInd = i;
      arr[minInd].state = ElementStates.Changing

      for (let j = i + 1; j < arr.length; j++) {
        arr[j].state = ElementStates.Changing;
        await updateColumnElementsWithInterval(setColumnArray, arr, SHORT_DELAY_IN_MS, isComponentMounted);

        if ((direction === Direction.Ascending && arr[j].value < arr[minInd].value) || (direction === Direction.Descending && arr[j].value > arr[minInd].value)) {
          minInd = j;
          arr[j].state = ElementStates.Changing;
          arr[minInd].state = i === minInd ? ElementStates.Changing : ElementStates.Default;
        }

        if (j !== minInd) arr[j].state = ElementStates.Default;
      }
      swap(arr, minInd, i);
      arr[minInd].state = ElementStates.Default;
      arr[i].state = ElementStates.Modified;
    }
    direction === Direction.Ascending ? setInProgressAsc(false) : setInProgressDesc(false);
  };

  // Функция метода сортировки пузырьком
  const bubbleSort = async (arr: ColumnElement[], direction: Direction) => {
    direction === Direction.Ascending ? setInProgressAsc(true) : setInProgressDesc(true);

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        arr[j].state = ElementStates.Changing;

        if (arr[j + 1]) arr[j + 1].state = ElementStates.Changing;
        await updateColumnElementsWithInterval(setColumnArray, arr, SHORT_DELAY_IN_MS, isComponentMounted);

        if ((direction === Direction.Ascending && arr[j].value > arr[j + 1]?.value) || (direction === Direction.Descending && arr[j].value < arr[j + 1]?.value)) {
          swap(arr, j + 1, j);
        }

        arr[j].state = ElementStates.Default;
        if (arr[j + 1]) arr[j + 1].state = ElementStates.Default;
      }
      arr[arr.length - i - 1].state = ElementStates.Modified;
    }
    direction === Direction.Ascending ? setInProgressAsc(false) : setInProgressDesc(false);
  } 

  // Обработка клика на кнопку "По возрастанию"
  const handleAscending = async () => {
    if (sortingMethod === SortingMethod.Selection) {
      const newArray = [...columnArray];
      await selectionSort(newArray, Direction.Ascending);
    }
    if (sortingMethod === SortingMethod.Bubble) {
      const newArray = [...columnArray];
      await bubbleSort(newArray, Direction.Ascending);
    }
  }

  // Обработка клика на кнопку "По убыванию"
  const handleDescending = async () => {
    if (sortingMethod === SortingMethod.Selection) {
      const newArray = [...columnArray];
      await selectionSort(newArray, Direction.Descending);
    }
    if (sortingMethod === SortingMethod.Bubble) {
      const newArray = [...columnArray];
      await bubbleSort(newArray, Direction.Descending);
    }
  }

  // Генерация нового массива по клику на кнопку "Новый массив"
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
            disabled={inProgressAsc || inProgressDesc}
          />
          <RadioInput 
            label="Пузырёк" 
            value="bubble" 
            checked={sortingMethod === SortingMethod.Bubble} 
            onChange={() => setSortingMethod(SortingMethod.Bubble)} 
            disabled={inProgressAsc || inProgressDesc}
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
