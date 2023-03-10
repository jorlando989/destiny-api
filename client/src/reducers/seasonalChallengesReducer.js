import { FETCH_SEASONAL_CHALLENGES } from "../actions/types";

export default function fetchSeasonalChallenges(state = [], action) {
    switch (action.type) {
        case FETCH_SEASONAL_CHALLENGES: 
            return action.payload || false;
        default:
            return state;
    };
};