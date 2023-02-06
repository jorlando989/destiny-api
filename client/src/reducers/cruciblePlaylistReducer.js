import { FETCH_CRUCIBLE_PLAYLIST } from "../actions/types";

export default function fetchCruciblePlaylist(state = false, action) {
    switch (action.type) {
        case FETCH_CRUCIBLE_PLAYLIST: 
            return action.payload || false;
        default:
            return state;
    };
};