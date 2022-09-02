const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class CoreSettings {
    async initialize(access_token) {
        const response = await fetch('https://www.bungie.net/Platform/Settings/', {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving core settings' });
        }
        const coreSettings = await response.json();
        this.coreSettings = coreSettings.Response.destiny2CoreSettings;
    }

    getSeasonalChallengesHash() {
        return this.coreSettings.seasonalChallengesPresentationNodeHash;
    }

    getCurrentSeasonHash() {
        return this.coreSettings.currentSeasonHash;
    }
}

module.exports = CoreSettings;