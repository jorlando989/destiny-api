import { SET_SEASONAL_CHALLENGE_VISIBILITY } from "../actions/types";

export default function(state = false, action) {
    switch (action.type) {
        case SET_SEASONAL_CHALLENGE_VISIBILITY: 
            return action.payload || false;
        default:
            return state;
    };
};