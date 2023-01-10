import { FETCH_CHARACTERS } from "../actions/types";

export default function fetchCharacters(state = [], action) {
    switch (action.type) {
        case FETCH_CHARACTERS: 
            return action.payload || false;
        default:
            return state;
    };
};