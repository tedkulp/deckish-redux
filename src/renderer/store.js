import { createStore } from 'easy-peasy';
import {
  forwardToMainWithParams,
  replayActionRenderer,
  getInitialStateRenderer
} from 'electron-redux';
import logger from 'redux-logger';
import rendererModel from './model';
import mainModel from '../main/model';

const initialState = getInitialStateRenderer();

export const store = createStore(
  {
    ...mainModel,
    ...rendererModel
  },
  {
    initialState,
    middleware: [
      forwardToMainWithParams({
        blacklist: [/^@/, /^@@/, /^redux-form/]
      }),
      logger
    ]
  }
);

replayActionRenderer(store);

export default {
  store
};
