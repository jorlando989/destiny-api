import { FETCH_WEEKLY_NIGHTFALL } from "../actions/types";

export default function fetchWeeklyNightfall(state = false, action) {
    switch (action.type) {
        case FETCH_WEEKLY_NIGHTFALL: 
            return action.payload || false;
        default:
            return state;
    };
};