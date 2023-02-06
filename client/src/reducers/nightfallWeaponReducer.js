import { FETCH_NIGHTFALL_WEAPON } from "../actions/types";

export default function fetchNightfallWeapon(state = [], action) {
    switch (action.type) {
        case FETCH_NIGHTFALL_WEAPON: 
            return action.payload || false;
        default:
            return state;
    };
};