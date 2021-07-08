import roomReducer from './room'
import errorsReducer from './errors'
import soundReducer from './sounds'
import { persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import { combineReducers } from 'redux'


const persistConfig = {
    key: 'root',
    storage: storageSession,
    whitelist: ['ROOM', 'ERRORS', 'SOUNDS']
}

const rootReducer = combineReducers({
    ROOM: roomReducer,
    ERRORS: errorsReducer,
    SOUNDS: soundReducer
});
export default persistReducer(persistConfig, rootReducer);