
import { createStore } from 'redux';
import allReducer from './reducersRedux/index';
import { persistStore } from 'redux-persist'

export const store = createStore(allReducer);
export const persistor = persistStore(store)
