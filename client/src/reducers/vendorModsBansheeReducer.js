import { FETCH_VENDOR_MODS_BANSHEE } from "../actions/types";

export default function fetchBansheeMods(state = [], action) {
    switch (action.type) {
        case FETCH_VENDOR_MODS_BANSHEE: 
            return action.payload || false;
        default:
            return state;
    };
};