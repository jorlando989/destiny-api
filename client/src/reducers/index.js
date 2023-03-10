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
import weeklyActivityVisibilityReducer from './weeklyActivityVisibilityReducer';
import checkManifestReducer from './checkManifestReducer';
import vendorModsReducerAda from './vendorModsReducerAda';
import vendorModsReducerBanshee from './vendorModsBansheeReducer';
import altarsOfSorrowReducer from './altarsOfSorrowReducer';
import wellspringReducer from './wellspringReducer';
import strikeModifiersReducer from './strikeModifiersReducer';
import weeklyNightfallReducer from './weeklyNightfallReducer';
import nightfallWeaponReducer from './nightfallWeaponReducer';
import cruciblePlaylistReducer from './cruciblePlaylistReducer';
import nightmareHuntsReducer from './nightmareHuntsReducer';
import empireHuntReducer from './empireHuntReducer';
import dreamingCityRotationsReducer from "./dreamingCityRotationsReducer";
import raidRotatorReducer from "./raidRotatorReducer";
import dungeonRotatorReducer from "./dungeonRotatorReducer";

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
    bounties: bountyReducer,
    weeklyActivityVisibility: weeklyActivityVisibilityReducer,
    checkManifestVersion: checkManifestReducer,
    vendorModsAda: vendorModsReducerAda,
    vendorModsBanshee: vendorModsReducerBanshee,
    altarsOfSorrowReward: altarsOfSorrowReducer,
    wellspringReward: wellspringReducer,
    strikeModifiers: strikeModifiersReducer,
    weeklyNightfall: weeklyNightfallReducer,
    nightfallWeapon: nightfallWeaponReducer,
    cruciblePlaylist: cruciblePlaylistReducer,
    nightmareHunts: nightmareHuntsReducer,
    empireHunt: empireHuntReducer,
    dreamingCityRotations: dreamingCityRotationsReducer,
    raidRotator: raidRotatorReducer,
    dungeonRotator: dungeonRotatorReducer
});