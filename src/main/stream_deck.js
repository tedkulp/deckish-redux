import { openStreamDeck } from 'elgato-stream-deck';
// eslint-disable-next-line import/no-cycle
import { handleUp, handleDown } from './key_handler';

export const streamDeck = openStreamDeck();

streamDeck.on('up', keyIndex => handleUp(keyIndex));
streamDeck.on('down', keyIndex => handleDown(keyIndex));

export function getNumberOfHeldKeys() {
  return streamDeck.keyState.filter(k => !!k).length;
}

streamDeck.clearAllKeys();

export function convertKey(keyIndex) {
  const row = Math.floor(keyIndex / 5);
  const col = keyIndex - row * 5;
  return {
    row,
    col
  };
}

export function convertKeyToXY(keyIndex) {
  return convertKey(keyIndex);
}

export function convertKeyToStringKey(keyIndex) {
  const { row, col } = convertKeyToXY(keyIndex);
  return `${col + 1},${row + 1}`;
}

export default {
  convertKey,
  convertKeyToXY,
  convertKeyToStringKey,
  streamDeck
};
