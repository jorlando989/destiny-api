const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async function checkForNewManifestVersion() {
    const headers = {
        'X-API-Key': keys.apiKey
    };
    const resp = await fetch('https://www.bungie.net/Platform/Destiny2/Manifest', { headers: headers });
    if (resp.status === 400 || resp.status === 401) {
        return { error: 'error retrieving manifest' };
    }
    const newManifest = await resp.json();
    const newVersion = newManifest.Response.version;
    const currVersion = localStorage.getItem('currManifestVersion');
    let currManifest = newManifest.Response.jsonWorldContentPaths.en;

    console.log('checking for new manifest');
    console.log(newVersion, currVersion);
    if (currVersion == null || newVersion !== currVersion) {
        console.log('new version found');
        localStorage.setItem('currManifestVersion', newVersion);
        currManifest = newManifest.Response.jsonWorldContentPaths.en;

        //download manifest if new and update files
        const resp2 = await fetch(`https://www.bungie.net${currManifest}`);
        if (resp2.status === 400 || resp2.status === 401) {
            return { error: 'error retrieving manifest data' };
        }
        const manifestData = await resp2.json();

        //get class def
        var fs = require('fs');
        fs.writeFileSync('../server/data/manifestData/classDefinitions.json', JSON.stringify(manifestData.DestinyClassDefinition), (err) => {
            if (err) { 
                console.log('error writing file:', err) 
            } else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync("books.txt", "utf8"));
            }
        });
        // console.log(JSON.stringify(manifestData.DestinyClassDefinition));

        //get race def
        fs.writeFileSync('../server/data/manifestData/raceDefinitions.json', JSON.stringify(manifestData.DestinyRaceDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get record def
        fs.writeFileSync('../server/data/manifestData/recordDefinitions.json', JSON.stringify(manifestData.DestinyRecordDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get inventory item def
        fs.writeFileSync('../server/data/manifestData/inventoryItemDefinitions.json', JSON.stringify(manifestData.DestinyInventoryItemDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get objective def
        fs.writeFileSync('../server/data/manifestData/objectiveDefinitions.json', JSON.stringify(manifestData.DestinyObjectiveDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get presentation node def
        fs.writeFileSync('../server/data/manifestData/presentationNodeDefinitions.json', JSON.stringify(manifestData.DestinyPresentationNodeDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get season def
        fs.writeFileSync('../server/data/manifestData/seasonDefinitions.json', JSON.stringify(manifestData.DestinySeasonDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get season pass def
        fs.writeFileSync('../server/data/manifestData/seasonPassDefinitions.json', JSON.stringify(manifestData.DestinySeasonPassDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get vendor group def
        fs.writeFileSync('../server/data/manifestData/vendorGroupDefinitions.json', JSON.stringify(manifestData.DestinyVendorGroupDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get vendor def
        fs.writeFileSync('../server/data/manifestData/vendorDefinitions.json', JSON.stringify(manifestData.DestinyVendorDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get destination def
        fs.writeFileSync('../server/data/manifestData/destinationDefinitions.json', JSON.stringify(manifestData.DestinyDestinationDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get progression def
        fs.writeFileSync('../server/data/manifestData/progressionDefinitions.json', JSON.stringify(manifestData.DestinyProgressionDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get milestone def
        fs.writeFileSync('../server/data/manifestData/milestoneDefinitions.json', JSON.stringify(manifestData.DestinyMilestoneDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get activity def
        fs.writeFileSync('../server/data/manifestData/activityDefinitions.json', JSON.stringify(manifestData.DestinyActivityDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get activity modifier def
        fs.writeFileSync('../server/data/manifestData/activityModifierDefinitions.json', JSON.stringify(manifestData.DestinyActivityModifierDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });

        //get activity mode def
        fs.writeFileSync('../server/data/manifestData/activityModeDefinitions.json', JSON.stringify(manifestData.DestinyActivityModeDefinition), (err) => {
            if (err) console.log('error writing file:', err)
        });
    } else {
        console.log('no update found');
    }

    return currVersion;
};