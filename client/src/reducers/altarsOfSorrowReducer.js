import { FETCH_ALTARS_OF_SORROW_REWARD } from "../actions/types";

export default function fetchAltarsOfSorrowReward(state = [], action) {
    switch (action.type) {
        case FETCH_ALTARS_OF_SORROW_REWARD: 
            return action.payload || false;
        default:
            return state;
    };
};