const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async function checkForNewManifestVersion(access_token) {
    const headers = {
        'X-API-Key': keys.apiKey,
        'Authorization': "Bearer " + access_token
    };
    const resp = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest', { headers: headers });
    if (resp.status === 400 || resp.status === 401) {
        return { error: 'error retrieving manifest' };
    }
    const newManifest = await resp.json();
    const newVersion = newManifest.Response.version;
    const currVersion = localStorage.getItem('currManifestVersion');
    let currManifest = newManifest.Response.jsonWorldContentPaths.en;

    // if (currVersion == null || newVersion !== currVersion) {
    if (true) {
        localStorage.setItem('currManifestVersion', newVersion);
        currManifest = newManifest.Response.jsonWorldContentPaths.en;

        //download manifest if new and update files
        const resp2 = await fetch(`https://www.bungie.net${currManifest}`);
        if (resp2.status === 400 || resp2.status === 401) {
            return { error: 'error retrieving manifest data' };
        }
        const manifestData = await resp2.json();

        //get class def
        var classDef = require('fs');
        classDef.writeFile('../server/data/manifestData/classDefinitions.json', JSON.stringify(manifestData.DestinyClassDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get race def
        var raceDef = require('fs');
        raceDef.writeFile('../server/data/manifestData/raceDefinitions.json', JSON.stringify(manifestData.DestinyRaceDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get record def
        var recordDef = require('fs');
        recordDef.writeFile('../server/data/manifestData/recordDefinitions.json', JSON.stringify(manifestData.DestinyRecordDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get inventory item def
        var inventoryItemDef = require('fs');
        inventoryItemDef.writeFile('../server/data/manifestData/inventoryItemDefinitions.json', JSON.stringify(manifestData.DestinyInventoryItemDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get obejctive def
        var objectiveDef = require('fs');
        objectiveDef.writeFile('../server/data/manifestData/objectiveDefinitions.json', JSON.stringify(manifestData.DestinyObjectiveDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get presentation node def
        var presentationNodeDef = require('fs');
        presentationNodeDef.writeFile('../server/data/manifestData/presentationNodeDefinitions.json', JSON.stringify(manifestData.DestinyPresentationNodeDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get season def
        var seasonDef = require('fs');
        seasonDef.writeFile('../server/data/manifestData/seasonDefinitions.json', JSON.stringify(manifestData.DestinySeasonDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get season pass def
        var seasonPassDef = require('fs');
        seasonPassDef.writeFile('../server/data/manifestData/seasonPassDefinitions.json', JSON.stringify(manifestData.DestinySeasonPassDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get vendor group def
        var vendorGroupDef = require('fs');
        vendorGroupDef.writeFile('../server/data/manifestData/vendorGroupDefinitions.json', JSON.stringify(manifestData.DestinyVendorGroupDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get vendor def
        var vendorDef = require('fs');
        vendorDef.writeFile('../server/data/manifestData/vendorDefinitions.json', JSON.stringify(manifestData.DestinyVendorDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get destination def
        var destinationDef = require('fs');
        destinationDef.writeFile('../server/data/manifestData/destinationDefinitions.json', JSON.stringify(manifestData.DestinyDestinationDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get progression def
        var progressionDef = require('fs');
        progressionDef.writeFile('../server/data/manifestData/progressionDefinitions.json', JSON.stringify(manifestData.DestinyProgressionDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get milestone def
        var milestoneDef = require('fs');
        milestoneDef.writeFile('../server/data/manifestData/milestoneDefinitions.json', JSON.stringify(manifestData.DestinyMilestoneDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get activity def
        var activityDef = require('fs');
        activityDef.writeFile('../server/data/manifestData/activityDefinitions.json', JSON.stringify(manifestData.DestinyActivityDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get activity modifier def
        var activityModifierDef = require('fs');
        activityModifierDef.writeFile('../server/data/manifestData/activityModifierDefinitions.json', JSON.stringify(manifestData.DestinyActivityModifierDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get activity mode def
        var activityModeDef = require('fs');
        activityModeDef.writeFile('../server/data/manifestData/activityModeDefinitions.json', JSON.stringify(manifestData.DestinyActivityModeDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });
    }

    return currVersion;
};