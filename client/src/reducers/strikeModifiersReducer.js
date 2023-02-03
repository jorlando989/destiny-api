import { FETCH_STRIKE_MODIFIERS } from "../actions/types";

export default function fetchStrikeModifiers(state = [], action) {
    switch (action.type) {
        case FETCH_STRIKE_MODIFIERS: 
            return action.payload || false;
        default:
            return state;
    };
};