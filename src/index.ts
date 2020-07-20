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

const makeMove = (element, storage, position): [string, number] => {
  let move = '';
  const movements = possibleMovements(element, storage, position);
  const shortestMove = movements.reduce(shorter);
  move += shortestMove;
  move += '.';
  return [move, movements.indexOf(shortestMove)];
};

const shorter = (left: string, right: string) =>
  left.length <= right.length ? left : right;

const possibleMovements = (element, storage: any[], position) => {
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

export { compile, walkToLetter };
