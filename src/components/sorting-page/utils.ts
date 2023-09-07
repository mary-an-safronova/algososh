import { ColumnElement, Direction, ElementStates } from "../../types/types";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { updateWithInterval, swap } from "../../utils/utils";
import { Dispatch } from "react";
import { SetStateAction } from "react";

// Функция генерации нового массива
export const createRandomArr = () => {
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
export const selectionSortFn = async (
    arr: ColumnElement[], 
    direction: Direction, 
    setState: (elements: ColumnElement[]) => void, 
    isComponentMounted: boolean,
    setInProgressAsc: Dispatch<SetStateAction<boolean>>,
    setInProgressDesc: Dispatch<SetStateAction<boolean>>,
    delay: number
    ) => {
        direction === Direction.Ascending ? setInProgressAsc(true) : setInProgressDesc(true);

        for (let i = 0; i < arr.length; i++) {
        let minInd = i;
        arr[minInd].state = ElementStates.Changing

        for (let j = i + 1; j < arr.length; j++) {
            arr[j].state = ElementStates.Changing;
            await updateWithInterval(setState, arr, delay, isComponentMounted);

            if ((direction === Direction.Ascending && arr[j].value < arr[minInd].value) || (direction === Direction.Descending && arr[j].value > arr[minInd].value)) {
                arr[minInd].state = ElementStates.Default;
                minInd = j;
                arr[minInd].state = ElementStates.Changing;
            } else {
                arr[j].state = i === minInd ? ElementStates.Changing : ElementStates.Default;
            }

            if (j !== minInd) arr[j].state = ElementStates.Default;
        }
        swap(arr, minInd, i);
        arr[minInd].state = ElementStates.Default;
        arr[i].state = ElementStates.Modified;
        }
        setState(arr);

        direction === Direction.Ascending ? setInProgressAsc(false) : setInProgressDesc(false);
    }

// Функция метода сортировки пузырьком
export const bubbleSortFn = async (
    arr: ColumnElement[], 
    direction: Direction, 
    setState: (elements: ColumnElement[]) => void, 
    isComponentMounted: boolean,
    setInProgressAsc: Dispatch<SetStateAction<boolean>>,
    setInProgressDesc: Dispatch<SetStateAction<boolean>>,
    delay: number
    ) => {
        direction === Direction.Ascending ? setInProgressAsc(true) : setInProgressDesc(true);

        for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            arr[j].state = ElementStates.Changing;

            if (arr[j + 1]) arr[j + 1].state = ElementStates.Changing;
            await updateWithInterval(setState, arr, delay, isComponentMounted);

            if ((direction === Direction.Ascending && arr[j].value > arr[j + 1]?.value) || (direction === Direction.Descending && arr[j].value < arr[j + 1]?.value)) {
            swap(arr, j + 1, j);
            }

            arr[j].state = ElementStates.Default;
            if (arr[j + 1]) arr[j + 1].state = ElementStates.Default;
        }
        arr[arr.length - i - 1].state = ElementStates.Modified;
        }
        setState(arr);

        direction === Direction.Ascending ? setInProgressAsc(false) : setInProgressDesc(false);
    }