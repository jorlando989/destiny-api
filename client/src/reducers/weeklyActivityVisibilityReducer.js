import { SET_WEEKLY_ACTIVITY_VISIBILITY } from "../actions/types";

export default function(state = false, action) {
    switch (action.type) {
        case SET_WEEKLY_ACTIVITY_VISIBILITY: 
            return action.payload || false;
        default:
            return state;
    };
};