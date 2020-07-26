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

const getLoopSequence = (phrase: string): [number, number] => {
  let start: number = 0;
  let end: number = 0;
  let letter: string = '.';

  let maxS = 0;
  let maxE = 0;

  for (let i = 0; i < phrase.length; i++) {
    if (phrase[i] === letter) {
      end = i;
    } else {
      start = i;
      end = i;
    }
    if (maxS - maxE < end - start) {
      maxS = start;
      maxE = end;
    }
  }
  console.log(phrase, start, end, maxS, maxE);
  return [maxS, maxE];
};

const getExpressionForLoop = (source: number, count: number): string => {
  const [forward, backward] = walkToLetter(source, count);
  const newMovement =
    Math.abs(forward) < Math.abs(backward)
      ? '+'.repeat(Math.abs(forward))
      : '-'.repeat(Math.abs(backward));
  return `>${newMovement}[<.>-]`;
};

const getAlternativeWithLoop = (phrase: string, source: number) => {
  let newP = phrase;
  let start: number = 0;
  let end = 0;

  [start, end] = getLoopSequence(newP);
  const loop = phrase.slice(start + 1, end + 1);
  console.log(loop);
  newP = newP.replace(loop, getExpressionForLoop(source, end - start));
  return newP;
};

export {
  compile,
  getAlphabetPosition,
  walkToLetter,
  getLoopSequence,
  getExpressionForLoop,
  getAlternativeWithLoop,
};
