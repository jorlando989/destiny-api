import { FETCH_DAILY_LOST_SECTOR } from "../actions/types";

export default function fetchDailyLostSector(state = null, action) {
    switch (action.type) {
        case FETCH_DAILY_LOST_SECTOR: 
            return action.payload || false;
        default:
            return state;
    };
};