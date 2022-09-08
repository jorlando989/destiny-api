import { FETCH_SEASONAL_ARTIFACT } from "../actions/types";

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_SEASONAL_ARTIFACT: 
            return action.payload || false;
        default:
            return state;
    };
};