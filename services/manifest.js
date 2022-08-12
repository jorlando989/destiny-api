const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class Manifest {
    constructor() {
        this.manifest = this.getManifestURLs();
    }

    async getManifestURLs() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const query = "https://www.bungie.net/Platform/Destiny2/Manifest/";
        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': currentUser.access_token
            }
        });
        const manifest = await response.json();
        return manifest;
    }

    async getClassInfo(classHash) {
        const manifest = await this.manifest;
        const jsonResponse = await fetch(`https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en.DestinyClassDefinition}`);
        const classInfo = await jsonResponse.json();

        const classes = Object.values(classInfo);
        for (var i = 0; i < classes.length; i++) {
            if (classHash === classes[i].hash) {
                return classes[i].displayProperties.name;
            }
        }
    }

    async getRaceInfo(raceHash) {
        const manifest = await this.manifest;
        const jsonResponse = await fetch(`https://www.bungie.net${manifest.Response.jsonWorldComponentContentPaths.en.DestinyRaceDefinition}`);
        const raceInfo = await jsonResponse.json();

        const races = Object.values(raceInfo);
        for (var i = 0; i < races.length; i++) {
            if (raceHash === races[i].hash) {
                return races[i].displayProperties.name;
            }
        }
    }
}

module.exports = Manifest;