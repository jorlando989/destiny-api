import { FETCH_WEEKLY_ACTIVITIES } from "../actions/types";

export default function fetchWeeklyActivities(state = [], action) {
    switch (action.type) {
        case FETCH_WEEKLY_ACTIVITIES: 
            return action.payload || false;
        default:
            return state;
    };
};