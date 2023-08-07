import { CircleElement } from "../types/types"

export const swap = <T>(arr: T[], firstIndex: number, secondIndex: number): void => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
}

export const getReversingStringSteps = (sourceString: string): string[][] => {
  const steps: string[][] = [];
  const letters = sourceString.split('');
  let start = 0;
  let end = letters.length - 1;

  while (start <= end) {
    if (end === start) {
      steps.push([...letters]);
      break;
    } else {
      swap(letters, start, end);
      steps.push([...letters]);
      start++;
      end--;
    }
  }
  return steps;
}

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const updateElementsWithInterval = async (
  setState: (elements: (CircleElement | null)[]) => void,
  elements: (CircleElement | null)[],
  delay: number,
  isComponentMounted: boolean,
) => {
  await sleep(delay);
  if (isComponentMounted) {
    setState([...elements]);
  }
};