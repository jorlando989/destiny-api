import { FETCH_EMPIRE_HUNT } from "../actions/types";

export default function fetchEmpireHunt(state = false, action) {
    switch (action.type) {
        case FETCH_EMPIRE_HUNT: 
            return action.payload || false;
        default:
            return state;
    };
};