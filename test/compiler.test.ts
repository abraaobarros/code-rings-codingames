import { CHAR_CODE_START_BASE, buildPatternTable } from './../src/index';
import { compile, walkToLetter } from '../src';

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
});
