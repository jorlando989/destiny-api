import { FETCH_SEASON_PASS } from "../actions/types";

export default function fetchSeasonPass(state = null, action) {
    switch (action.type) {
        case FETCH_SEASON_PASS: 
            return action.payload || false;
        default:
            return state;
    };
};