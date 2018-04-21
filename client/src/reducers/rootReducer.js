import { combineReducers } from 'redux';
import qbReducer from './qbReducer';

const rootReducer = combineReducers({
    // qbAuthUriReducer: qbReducer
    qbReducer
});

export default rootReducer;