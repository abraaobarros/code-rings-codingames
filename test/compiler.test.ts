import { CHAR_CODE_START_BASE, getLoopSequence } from './../src/index';
import {
  compile,
  walkToLetter,
  getAlphabetPosition,
  getExpressionForLoop,
  getAlternativeWithLoop,
} from '../src';

describe('compiler test', () => {
  it('should print compiler', () => {
    expect(compile('AZ')[0]).toEqual('+.--.');
    expect(compile(' ')[0]).toEqual('.');
  });

  it('should use limited storage', () => {
    expect(
      compile('UMNE TALMAR RAHTAINE NIXENEN UMIR')[1].length
    ).toBeLessThanOrEqual(30);
  });

  it('should walk from letter to other', () => {
    expect(walkToLetter('A'.charCodeAt(0), 'B'.charCodeAt(0))).toEqual([1, 26]);
    expect(walkToLetter('B'.charCodeAt(0), 'A'.charCodeAt(0))).toEqual([26, 1]);
    expect(walkToLetter(' '.charCodeAt(0), 'A'.charCodeAt(0))).toEqual([1, 26]);
    expect(walkToLetter(' '.charCodeAt(0), 'Z'.charCodeAt(0))).toEqual([26, 1]);
  });

  it('should identify loops', () => {
    const movement: string = '------------...............';
    const [start, end] = getLoopSequence(movement);
    expect([start, end]).toEqual([11, 26]);
    expect(
      getExpressionForLoop(getAlphabetPosition(' '.charCodeAt(0)), start - end)
    ).toBe('>++++++++++++[<.>-]');
  });

  it('should return alternative loop', () => {
    expect(
      getExpressionForLoop(getAlphabetPosition(' '.charCodeAt(0)), 4)
    ).toBe('>++++[<.>-]');
  });

  it('should replace phrase for loops', () => {
    const movement: string = '------------...............';
    expect(
      getAlternativeWithLoop(movement, getAlphabetPosition(' '.charCodeAt(0)))
    ).toBe('------------>------------[<.>-]');
  });

  it('should replace phrase for many loops', () => {
    const movement: string = '------------..................--.....';
    expect(
      getAlternativeWithLoop(movement, getAlphabetPosition(' '.charCodeAt(0)))
    ).toBe('    ');
  });
});
