//reducers are part of redux - hold state of app
import { combineReducers } from "redux";
import authReducer from "./authReducer";

export default combineReducers({
    auth: authReducer
});