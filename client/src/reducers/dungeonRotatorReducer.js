import { FETCH_DUNGEON_ROTATOR } from "../actions/types";

export default function fetchDungeonRotation(state = false, action) {
    switch (action.type) {
        case FETCH_DUNGEON_ROTATOR: 
            return action.payload || false;
        default:
            return state;
    };
};