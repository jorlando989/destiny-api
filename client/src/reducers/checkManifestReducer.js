import { CHECK_FOR_NEW_MANIFEST_VERSION } from "../actions/types";

export default function(state = false, action) {
    switch (action.type) {
        case CHECK_FOR_NEW_MANIFEST_VERSION: 
            return action.payload || false;
        default:
            return state;
    };
};