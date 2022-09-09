import { FETCH_BOUNTIES } from "../actions/types";

export default function(state = [], action) {
    switch (action.type) {
        case FETCH_BOUNTIES: 
            return action.payload || false;
        default:
            return state;
    };
};