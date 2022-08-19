//reducers are part of redux - hold state of app
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import vendorReducer from './vendorReducer';
import characterReducer from './characterReducer';
import selectCharReducer from "./selectCharReducer";

export default combineReducers({
    auth: authReducer,
    vendors: vendorReducer,
    characters: characterReducer,
    currChar: selectCharReducer
});