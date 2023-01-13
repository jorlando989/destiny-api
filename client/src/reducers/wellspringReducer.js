import { FETCH_WELLSPRING_REWARD } from "../actions/types";

export default function fetchWellspringReward(state = [], action) {
    switch (action.type) {
        case FETCH_WELLSPRING_REWARD: 
            return action.payload || false;
        default:
            return state;
    };
};