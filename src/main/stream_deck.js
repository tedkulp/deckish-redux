import StreamDeck from 'elgato-stream-deck';
import { handleUp, handleDown } from './key_handler';

export const streamDeck = new StreamDeck();

streamDeck.on('up', keyIndex => handleUp(keyIndex));
streamDeck.on('down', keyIndex => handleDown(keyIndex));

streamDeck.clearAllKeys();

export function convertKey(keyIndex) {
  const row = Math.floor(keyIndex / 5);
  const col = 5 - (keyIndex - 5 * row) - 1;
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
