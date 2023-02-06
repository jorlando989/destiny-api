import { FETCH_DREAMING_CITY_ROTATIONS } from "../actions/types";

export default function fetchDreamingCityRotations(state = false, action) {
    switch (action.type) {
        case FETCH_DREAMING_CITY_ROTATIONS: 
            return action.payload || false;
        default:
            return state;
    };
};