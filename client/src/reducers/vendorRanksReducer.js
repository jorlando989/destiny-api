import { FETCH_VENDOR_RANKS } from "../actions/types";

export default function fetchVendorRanks(state = [], action) {
    switch (action.type) {
        case FETCH_VENDOR_RANKS: 
            return action.payload || false;
        default:
            return state;
    };
};