export const CHAR_CODE_START_BASE = 64;
export const CHAR_CODE_END_BASE = 91;
export const STORAGE_SIZE = 30;

const compile = (phrase: string) => {
  let compiled: string = '';
  let storage = Array(30).fill(' '.charCodeAt(0));
  let position = 0;

  for (let index = 0; index < phrase.length; index++) {
    const element = phrase[index].charCodeAt(0);
    const [move, newPosition] = makeMove(element, storage, position);
    compiled += move;
    storage[newPosition % 30] = element;
    position = newPosition;
  }

  return [compiled, storage];
};

const makeMove = (
  element: number,
  storage: number[],
  position: number
): [string, number] => {
  const movements = possibleMovements(element, storage, position);
  const shortestMove = movements.reduce(shorter);
  return [shortestMove + '.', movements.indexOf(shortestMove)];
};

const shorter = (left: string, right: string) =>
  left.length <= right.length ? left : right;

const possibleMovements = (
  element: number,
  storage: number[],
  position: number
) => {
  return storage.map((value, index) => {
    let newMovement =
      index > position
        ? '>'.repeat(index - position)
        : '<'.repeat(position - index);

    const [forward, backward] = walkToLetter(value, element);
    newMovement +=
      forward < backward ? '+'.repeat(forward) : '-'.repeat(backward);
    return newMovement;
  });
};

const walkToLetter = (source: number, target: number) => {
  const start = getAlphabetPosition(source);
  const end = getAlphabetPosition(target);
  const mod = CHAR_CODE_END_BASE - CHAR_CODE_START_BASE;
  if (start < end) {
    return [end - start, mod + start - end];
  } else {
    return [mod - start + end, start - end];
  }
};

const getAlphabetPosition = (element: number) => {
  return element === 32 ? 0 : element - CHAR_CODE_START_BASE;
};

const findLoops = (phrase: string) => {};

function buildPatternTable(word) {
  const patternTable = [0];
  let prefixIndex = 0;
  let suffixIndex = 1;

  while (suffixIndex < word.length) {
    if (word[prefixIndex] === word[suffixIndex]) {
      patternTable[suffixIndex] = prefixIndex + 1;
      suffixIndex += 1;
      prefixIndex += 1;
    } else if (prefixIndex === 0) {
      patternTable[suffixIndex] = 0;
      suffixIndex += 1;
    } else {
      prefixIndex = patternTable[prefixIndex - 1];
    }
  }

  return patternTable;
}

/**
 * @param {string} text
 * @param {string} word
 * @return {number}
 */
export default function knuthMorrisPratt(text, word) {
  if (word.length === 0) {
    return 0;
  }

  let textIndex = 0;
  let wordIndex = 0;

  const patternTable = buildPatternTable(word);

  while (textIndex < text.length) {
    if (text[textIndex] === word[wordIndex]) {
      // We've found a match.
      if (wordIndex === word.length - 1) {
        return textIndex - word.length + 1;
      }
      wordIndex += 1;
      textIndex += 1;
    } else if (wordIndex > 0) {
      wordIndex = patternTable[wordIndex - 1];
    } else {
      wordIndex = 0;
      textIndex += 1;
    }
  }

  return -1;
}

export { compile, walkToLetter, kpm };
