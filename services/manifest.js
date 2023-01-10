const classDefinitions = require('../data/manifestData/classDefinitions.json');
const raceDefinitions = require('../data/manifestData/raceDefinitions.json');
const recordDefinitions = require('../data/manifestData/recordDefinitions.json');
const inventoryItemDefinitions = require('../data/manifestData/inventoryItemDefinitions.json');
const objectiveDefinitions = require('../data/manifestData/objectiveDefinitions.json');
const presentationNodeDefinitions = require('../data/manifestData/presentationNodeDefinitions.json');
const seasonDefinitions = require('../data/manifestData/seasonDefinitions.json');
const seasonPassDefinitions = require('../data/manifestData/seasonPassDefinitions.json');
const vendorGroupDefinitions = require('../data/manifestData/vendorGroupDefinitions.json');
const vendorDefinitions = require('../data/manifestData/vendorDefinitions.json');
const destinationDefinitions = require('../data/manifestData/destinationDefinitions.json');
const progressionDefinitions = require('../data/manifestData/progressionDefinitions.json');
const milestoneDefinitions = require('../data/manifestData/milestoneDefinitions.json');
const activityDefinitions = require('../data/manifestData/activityDefinitions.json');
const activityModifierDefinitions = require('../data/manifestData/activityModifierDefinitions.json');
const activityModeDefinitions = require('../data/manifestData/activityModeDefinitions.json');

class Manifest {
    constructor() {}

    getClassInfo(classHash) {
        return classDefinitions[classHash];
    }

    getRaceInfo(raceHash) {
        return raceDefinitions[raceHash];
    }

    getVendorGroupInfo(vendorGroupHash) {
        return vendorGroupDefinitions[vendorGroupHash];
    }

    getVendorInfo(vendorHash) {
        return vendorDefinitions[vendorHash];
    }

    getLocationInfo(locationHash) {
        return destinationDefinitions[locationHash];
    }

    getItemInfo(itemHash) {
        return inventoryItemDefinitions[itemHash];
    }

    getMilestoneInfo(milestoneHash) {
        return milestoneDefinitions[milestoneHash];
    }

    getActivityInfo(activityHash) {
        return activityDefinitions[activityHash];
    }

    getActivityModifierInfo(activityModifierHash) {
        return activityModifierDefinitions[activityModifierHash];
    }

    getActivityModeInfo(activityModeHash) {
        return activityModeDefinitions[activityModeHash];
    }

    getObjectiveInfo(objectiveHash) {
        return objectiveDefinitions[objectiveHash];
    }

    getProgressionInfo(progressionHash) {
        return progressionDefinitions[progressionHash];
    }

    getPresentationNodeInfo(presentationNodeHash) {
        return presentationNodeDefinitions[presentationNodeHash];
    }

    getRecordInfo(recordHash) {
        return recordDefinitions[recordHash];
    }

    getSeasonInfo(seasonHash) {
        return seasonDefinitions[seasonHash];
    }

    getSeasonPassInfo(seasonPassHash) {
        return seasonPassDefinitions[seasonPassHash];
    }
}

module.exports = Manifest;