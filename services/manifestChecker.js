const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const neededDefs = require("../data/neededManifestDefs.json");

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
    // if (currVersion == null || newVersion !== currVersion) {
    if(true){
        console.log('new version found');
        localStorage.setItem('currManifestVersion', newVersion);

        //download needed manifest files
        currManifest = newManifest.Response.jsonWorldComponentContentPaths.en;
        const fs = require('fs');
        
        console.log(process.cwd());
        let directory_name = '../server';
        let filenames = fs.readdirSync(directory_name);
        console.log("\nFilenames in directory:");
        filenames.forEach((file) => {
                console.log("File:", file);
        });

        Object.values(neededDefs).forEach(async def => {
            const resp2 = await fetch(`https://www.bungie.net${currManifest[def.name]}`);
            if (resp2.status === 400 || resp2.status === 401) {
                return { error: 'error retrieving class data' };
            }
            const responseData = await resp2.json();
            fs.writeFileSync(def.filePath, JSON.stringify(responseData), (err) => {
                if (err) console.log('error writing file:', err)
            });
        });
    } else {
        console.log('no update found');
    }

    return currVersion;
};