import { swap } from "../../utils/utils";

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