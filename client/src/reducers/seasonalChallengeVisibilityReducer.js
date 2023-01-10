import { SET_SEASONAL_CHALLENGE_VISIBILITY } from "../actions/types";

export default function setSeasonalChallengeVisibility(state = false, action) {
    switch (action.type) {
        case SET_SEASONAL_CHALLENGE_VISIBILITY: 
            return action.payload || false;
        default:
            return state;
    };
};