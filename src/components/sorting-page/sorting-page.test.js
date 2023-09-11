import { selectionSortFn, bubbleSortFn } from "./utils";
import { Direction, ElementStates } from "../../types/types";

describe('SortingPage', () => {
  const setState = jest.fn();
  const setInProgressAsc = jest.fn();
  const setInProgressDesc = jest.fn();

  it('should correctly sort the empty array by the ascending selection method', async () => {
      const arr = [];
  
      await selectionSortFn(arr, Direction.Ascending, setState, true, setInProgressAsc, setInProgressDesc, 0);
  
      expect(setState).toHaveBeenCalledWith([]);
      expect(setInProgressAsc).toHaveBeenCalledWith(false);
      expect(setInProgressDesc).not.toHaveBeenCalled();
  });

  it('should correctly sort the empty array by the descending selection method', async () => {
    const arr = [];

    await selectionSortFn(arr, Direction.Descending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([]);
    expect(setInProgressAsc).not.toHaveBeenCalled();
    expect(setInProgressDesc).toHaveBeenCalledWith(false);
  });

  it('should correctly sort the empty array by the ascending bubble method', async () => {
    const arr = [];

    await bubbleSortFn(arr, Direction.Ascending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([]);
    expect(setInProgressAsc).toHaveBeenCalledWith(false);
    expect(setInProgressDesc).not.toHaveBeenCalled();
  });

  it('should correctly sort the empty array by the descending bubble method', async () => {
    const arr = [];

    await bubbleSortFn(arr, Direction.Descending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([]);
    expect(setInProgressAsc).not.toHaveBeenCalled();
    expect(setInProgressDesc).toHaveBeenCalledWith(false);
  });



  it('should correctly sort an array with one element by the ascending selection method', async () => {
    const arr = [{ value: 5, state: ElementStates.Default }];

    await selectionSortFn(arr, Direction.Ascending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([{ value: 5, state: ElementStates.Modified }]);
    expect(setInProgressAsc).toHaveBeenCalledWith(false);
    expect(setInProgressDesc).not.toHaveBeenCalled();
  });

  it('should correctly sort an array with one element by the descending selection method', async () => {
    const arr = [{ value: 5, state: ElementStates.Default }];

    await selectionSortFn(arr, Direction.Descending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([{ value: 5, state: ElementStates.Modified }]);
    expect(setInProgressAsc).not.toHaveBeenCalled();
    expect(setInProgressDesc).toHaveBeenCalledWith(false);
  });

  it('should correctly sort an array with one element by the ascending bubble method', async () => {
    const arr = [{ value: 5, state: ElementStates.Default }];

    await bubbleSortFn(arr, Direction.Ascending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([{ value: 5, state: ElementStates.Modified }]);
    expect(setInProgressAsc).toHaveBeenCalledWith(false);
    expect(setInProgressDesc).not.toHaveBeenCalled();
  });

  it('should correctly sort an array with one element by the descending bubble method', async () => {
    const arr = [{ value: 5, state: ElementStates.Default }];

    await bubbleSortFn(arr, Direction.Descending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([{ value: 5, state: ElementStates.Modified }]);
    expect(setInProgressAsc).not.toHaveBeenCalled();
    expect(setInProgressDesc).toHaveBeenCalledWith(false);
  });



  it('should correctly sort an array with multiple elements by the ascending selection method', async () => {
    const arr = [
      { value: 3, state: ElementStates.Default },
      { value: 1, state: ElementStates.Default },
      { value: 2, state: ElementStates.Default },
    ];

    await selectionSortFn(arr, Direction.Ascending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([
      { value: 1, state: ElementStates.Modified },
      { value: 2, state: ElementStates.Modified },
      { value: 3, state: ElementStates.Modified },
    ]);
    expect(setInProgressAsc).toHaveBeenCalledWith(false);
    expect(setInProgressDesc).not.toHaveBeenCalled();
  });

  it('should correctly sort an array with multiple elements by the descending selection method', async () => {
    const arr = [
      { value: 3, state: ElementStates.Default },
      { value: 1, state: ElementStates.Default },
      { value: 2, state: ElementStates.Default },
    ];

    await selectionSortFn(arr, Direction.Descending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([
      { value: 3, state: ElementStates.Modified },
      { value: 2, state: ElementStates.Modified },
      { value: 1, state: ElementStates.Modified },
    ]);
    expect(setInProgressAsc).not.toHaveBeenCalled();
    expect(setInProgressDesc).toHaveBeenCalledWith(false);
  });

  it('should correctly sort an array with multiple elements by the ascending bubble method', async () => {
    const arr = [
      { value: 3, state: ElementStates.Default },
      { value: 1, state: ElementStates.Default },
      { value: 2, state: ElementStates.Default },
    ];

    await bubbleSortFn(arr, Direction.Ascending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([
      { value: 1, state: ElementStates.Modified },
      { value: 2, state: ElementStates.Modified },
      { value: 3, state: ElementStates.Modified },
    ]);
    expect(setInProgressAsc).toHaveBeenCalledWith(false);
    expect(setInProgressDesc).not.toHaveBeenCalled();
  });

  it('should correctly sort an array with multiple elements by the descending bubble method', async () => {
    const arr = [
      { value: 3, state: ElementStates.Default },
      { value: 1, state: ElementStates.Default },
      { value: 2, state: ElementStates.Default },
    ];

    await bubbleSortFn(arr, Direction.Descending, setState, true, setInProgressAsc, setInProgressDesc, 0);

    expect(setState).toHaveBeenCalledWith([
      { value: 3, state: ElementStates.Modified },
      { value: 2, state: ElementStates.Modified },
      { value: 1, state: ElementStates.Modified },
    ]);
    expect(setInProgressAsc).not.toHaveBeenCalled();
    expect(setInProgressDesc).toHaveBeenCalledWith(false);
  });
})