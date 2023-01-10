import { FETCH_VENDOR_MODS_ADA } from "../actions/types";

export default function(state = [], action) {
    switch (action.type) {
        case FETCH_VENDOR_MODS_ADA: 
            return action.payload || false;
        default:
            return state;
    };
};