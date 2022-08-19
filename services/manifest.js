const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class Manifest {
    constructor(access_token) {
        this.access_token = access_token;
    }

    async getClassInfo(classHash) {
        const resp = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyClassDefinition/${classHash}/`, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + this.access_token
            }
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving class info for ' + classHash };
        }
        const classInfo = await resp.json();
        return classInfo.Response;
    }

    async getRaceInfo(raceHash) {
        const resp = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyRaceDefinition/${raceHash}/`, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + this.access_token
            }
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving race info for ' + raceHash };
        }
        const raceInfo = await resp.json();
        return raceInfo.Response;
    }

    async getVendorGroupInfo(vendorGroupHash) {
        const resp = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyVendorGroupDefinition/${vendorGroupHash}/`, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + this.access_token
            }
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving vendor group info for ' + vendorGroupHash };
        }
        const vendorGroupInfo = await resp.json();
        return vendorGroupInfo.Response;
    }

    async getVendorInfo(vendorHash) {
        const resp = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyVendorDefinition/${vendorHash}/`, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + this.access_token
            }
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving vendor info for ' + vendorHash };
        }
        const vendorInfo = await resp.json();
        return vendorInfo.Response;
    }

    async getLocationInfo(locationHash) {
        const resp = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyDestinationDefinition/${locationHash}/`, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + this.access_token
            }
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving location info for ' + locationHash };
        }
        const destinationInfo = await resp.json();
        return destinationInfo.Response;
    }

    async getItemInfo(itemHash) {
        const resp = await fetch(`https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${itemHash}/`, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + this.access_token
            }
        });
        if (resp.status === 400 || resp.status === 401) {
            return { error: 'error retrieving item info for ' + itemHash };
        }
        const itemInfo = await resp.json();
        return itemInfo.Response;
    }
}

module.exports = Manifest;