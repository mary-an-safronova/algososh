export const swap = <T>(arr: T[], firstIndex: number, secondIndex: number): void => {
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
}

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const updateElementsWithInterval = async <T>(
  setState: (elements: (T | null)[]) => void,
  elements: (T | null)[],
  delay: number,
  isComponentMounted: boolean,
) => {
  await sleep(delay);
  if (isComponentMounted) {
    setState([...elements]);
  }
};

export const updateWithInterval = async <T>(
  setState: (elements: T[]) => void,
  elements: T[],
  delay: number,
  isComponentMounted: boolean,
) => {
  await sleep(delay);
  if (isComponentMounted) {
    setState([...elements]);
  }
};