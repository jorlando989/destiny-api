import { FETCH_RAID_ROTATOR } from "../actions/types";

export default function fetchRaidRotation(state = false, action) {
    switch (action.type) {
        case FETCH_RAID_ROTATOR: 
            return action.payload || false;
        default:
            return state;
    };
};