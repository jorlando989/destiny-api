import { SELECT_CHAR, FETCH_SELECTED_CHAR } from "../actions/types";

export default function(state = null, action) {
    switch (action.type) {
        case SELECT_CHAR:
            return action.payload || false;
        case FETCH_SELECTED_CHAR:
            return action.payload || false;
        default:
            return state;
    };
};