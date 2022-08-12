import { FETCH_VENDORS } from "../actions/types";

export default function(state = [], action) {
    switch (action.type) {
        case FETCH_VENDORS: 
            return action.payload || false;
        default:
            return state;
    };
};