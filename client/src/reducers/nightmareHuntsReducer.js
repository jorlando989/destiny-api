import { FETCH_NIGHTMARE_HUNTS } from "../actions/types";

export default function fetchNightmareHunts(state = false, action) {
    switch (action.type) {
        case FETCH_NIGHTMARE_HUNTS: 
            return action.payload || false;
        default:
            return state;
    };
};