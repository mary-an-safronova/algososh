import React, { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import sortingPageStyle from "./sorting-page.module.css";
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { SortingMethod, ColumnElement, Direction } from "../../types/types";
import { useEffect } from "react";
import { createRandomArr, selectionSortFn, bubbleSortFn } from "./utils";
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

  // Функция метода сортировки выбором
  const selectionSort = (direction: Direction) => {
    const newArray = [...columnArray];
    selectionSortFn(newArray, direction, setColumnArray, isComponentMounted, setInProgressAsc, setInProgressDesc, SHORT_DELAY_IN_MS);
  };

  // Функция метода сортировки пузырьком
  const bubbleSort = (direction: Direction) => {
    const newArray = [...columnArray];
    bubbleSortFn(newArray, direction, setColumnArray, isComponentMounted, setInProgressAsc, setInProgressDesc, SHORT_DELAY_IN_MS);
  } 

  // Обработка клика на кнопку "По возрастанию"
  const handleAscending = async () => {
    if (sortingMethod === SortingMethod.Selection) {
      await selectionSort(Direction.Ascending);
    }
    if (sortingMethod === SortingMethod.Bubble) {
      await bubbleSort(Direction.Ascending);
    }
  }

  // Обработка клика на кнопку "По убыванию"
  const handleDescending = async () => {
    if (sortingMethod === SortingMethod.Selection) {
      await selectionSort(Direction.Descending);
    }
    if (sortingMethod === SortingMethod.Bubble) {
      await bubbleSort(Direction.Descending);
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
