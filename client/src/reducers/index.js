//reducers are part of redux - hold state of app
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import vendorReducer from './vendorReducer';
import characterReducer from './characterReducer';
import selectCharReducer from "./selectCharReducer";
import weeklyActivitiesReducer from './weeklyActivitiesReducer';
import vendorRanksReducer from "./vendorRanksReducer";
import seasonalChallengesReducer from "./seasonalChallengesReducer";
import seasonalChallengeVisibilityReducer from "./seasonalChallengeVisibilityReducer";
import lostSectorReducer from "./lostSectorReducer";
import seasonalArtifactReducer from "./seasonalArtifactReducer";
import seasonPassReducer from './seasonPassReducer';
import bountyReducer from './bountyReducer';

export default combineReducers({
    auth: authReducer,
    vendors: vendorReducer,
    characters: characterReducer,
    currChar: selectCharReducer,
    weeklyActivities: weeklyActivitiesReducer,
    vendorRanks: vendorRanksReducer,
    seasonalChallenges: seasonalChallengesReducer,
    seasonalChallengeVisibility: seasonalChallengeVisibilityReducer,
    dailyLostSector: lostSectorReducer,
    seasonalArtifact: seasonalArtifactReducer,
    seasonPass: seasonPassReducer,
    bounties: bountyReducer
});