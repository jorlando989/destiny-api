const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class Manifest {
    constructor(access_token) {
        this.headers = {
            'X-API-Key': keys.apiKey,
            'Authorization': "Bearer " + access_token
        };
        this.base = 'https://www.bungie.net/Platform/Destiny2/Manifest';
    }

    async getClassInfo(classHash) {
        const resp = await fetch(`${this.base}/DestinyClassDefinition/${classHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving class info for ' + classHash };
        }
        const classInfo = await resp.json();
        return classInfo.Response;
    }

    async getRaceInfo(raceHash) {
        const resp = await fetch(`${this.base}/DestinyRaceDefinition/${raceHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving race info for ' + raceHash };
        }
        const raceInfo = await resp.json();
        return raceInfo.Response;
    }

    async getVendorGroupInfo(vendorGroupHash) {
        const resp = await fetch(`${this.base}/DestinyVendorGroupDefinition/${vendorGroupHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving vendor group info for ' + vendorGroupHash };
        }
        const vendorGroupInfo = await resp.json();
        return vendorGroupInfo.Response;
    }

    async getVendorInfo(vendorHash) {
        const resp = await fetch(`${this.base}/DestinyVendorDefinition/${vendorHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving vendor info for ' + vendorHash };
        }
        const vendorInfo = await resp.json();
        return vendorInfo.Response;
    }

    async getLocationInfo(locationHash) {
        const resp = await fetch(`${this.base}/DestinyDestinationDefinition/${locationHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving location info for ' + locationHash };
        }
        const destinationInfo = await resp.json();
        return destinationInfo.Response;
    }

    async getItemInfo(itemHash) {
        const resp = await fetch(`${this.base}/DestinyInventoryItemDefinition/${itemHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving item info for ' + itemHash };
        }
        const itemInfo = await resp.json();
        return itemInfo.Response;
    }

    async getMilestoneInfo(milestoneHash) {
        const resp = await fetch(`${this.base}/DestinyMilestoneDefinition/${milestoneHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving milestone info for ' + milestoneHash };
        }
        const milestoneInfo = await resp.json();
        return milestoneInfo.Response;
    }

    async getActivityInfo(activityHash) {
        const resp = await fetch(`${this.base}/DestinyActivityDefinition/${activityHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving activity info for ' + activityHash };
        }
        const activityInfo = await resp.json();
        return activityInfo.Response;
    }

    async getActivityModifierInfo(activityModifierHash) {
        const resp = await fetch(`${this.base}/DestinyActivityModifierDefinition/${activityModifierHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving activity modifier info for ' + activityModifierHash };
        }
        const activityModifierInfo = await resp.json();
        return activityModifierInfo.Response;
    }

    async getObjectiveInfo(objectiveHash) {
        const resp = await fetch(`${this.base}/DestinyObjectiveDefinition/${objectiveHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving objective info for ' + objectiveHash };
        }
        const objectiveInfo = await resp.json();
        return objectiveInfo.Response;
    }

    async getProgressionInfo(progressionHash) {
        const resp = await fetch(`${this.base}/DestinyProgressionDefinition/${progressionHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving progression info for ' + progressionHash };
        }
        const progressionInfo = await resp.json();
        return progressionInfo.Response;
    }

    async getPresentationNodeInfo(presentationNodeHash) {
        const resp = await fetch(`${this.base}/DestinyPresentationNodeDefinition/${presentationNodeHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving presentation node info for ' + presentationNodeHash };
        }
        const presentationNodeInfo = await resp.json();
        return presentationNodeInfo.Response;
    }

    async getRecordInfo(recordHash) {
        const resp = await fetch(`${this.base}/DestinyRecordDefinition/${recordHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving record info for ' + recordHash };
        }
        const recordInfo = await resp.json();
        return recordInfo.Response;
    }

    async getSeasonInfo(seasonHash) {
        const resp = await fetch(`${this.base}/DestinySeasonDefinition/${seasonHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving season info for ' + seasonHash };
        }
        const seasonInfo = await resp.json();
        return seasonInfo.Response;
    }

    async getSeasonPassInfo(seasonPassHash) {
        const resp = await fetch(`${this.base}/DestinySeasonPassDefinition/${seasonPassHash}/`, {
            headers: this.headers
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving season pass info for ' + seasonPassHash };
        }
        const seasonPassInfo = await resp.json();
        return seasonPassInfo.Response;
    }
}

module.exports = Manifest;