import { action, computed } from 'easy-peasy';
import { get, isEqual } from 'lodash';

export const getButtonAtIndex = (state, idx) => {
  if (!idx) idx = state.currentIndex;

  if (state.editingLayoutNames.length <= 1) {
    return get(state.config, idx);
  }

  const layoutLocation = state.editingLayoutNames
    .slice(1)
    .reduce((acc, layout) => `${acc}.${layout}.layout`, '')
    .replace(/^\./, '');
  return get(get(state.config, layoutLocation, {}), idx);
};

export default {
  currentIndex: undefined,
  currentButton: computed(state => getButtonAtIndex(state)),
  editingLayoutNames: ['root'],
  addToEditingLayoutNames: action((state, payload) => {
    state.editingLayoutNames.push(payload);
  }),
  removeFromEditingLayoutNames: action((state, payload) => {
    const idx = state.editingLayoutNames.findIndex(l => isEqual(l, payload));
    if (idx > -1) {
      state.editingLayoutNames.slice(idx, 1);
    }
  }),
  clearEditingLayoutNames: action((state, _payload) => {
    state.editingLayoutNames = ['root'];
  }),
  setEditingLayoutNames: action((state, payload) => {
    state.editingLayoutNames = payload;
  }),
  setCurrentIndex: action((state, payload) => {
    state.currentIndex = payload;
  }),
  clearCurrentIndex: action((state, _payload) => {
    state.currentIndex = undefined;
  })
};
