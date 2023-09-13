import { getReversingStringSteps } from "./utils";

describe('StringComponent', () => {
  it('should correctly renders with an even number of characters', () => {
    const string = "qwerty";
    expect(getReversingStringSteps(string)).toEqual([["y", "w", "e", "r", "t", "q"],["y", "t", "e", "r", "w", "q"], ["y", "t", "r", "e", "w", "q"]]);
  });

  it('should correctly renders with an odd number of characters', () => {
    const string = "hello";
    expect(getReversingStringSteps(string)).toEqual([["o", "e", "l", "l", "h"],["o", "l", "l", "e", "h"], ["o", "l", "l", "e", "h"]]);
  });

  it('should correctly renders with a single character', () => {
    const string = "a";
    expect(getReversingStringSteps(string)).toEqual([["a"]]);
  });

  it('should correctly renders with an empty string', () => {
    const string = "";
    expect(getReversingStringSteps(string)).toEqual([]);
  });
});