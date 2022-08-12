//reducers are part of redux - hold state of app
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import vendorReducer from './vendorReducer';
import characterReducer from './characterReducer';

export default combineReducers({
    auth: authReducer,
    vendors: vendorReducer,
    characters: characterReducer
});