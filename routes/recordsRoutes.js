const keys = require('../config/keys');
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const requireLogin = require('../middlewares/requireLogin');
const checkAccessToken = require('../middlewares/checkAccessToken');

const Manifest = require('../services/manifest');
const CoreSettings = require('../services/coreSettings');
const User = mongoose.model('users');

module.exports = app => { 
    app.get("/api/seasonal_challenges", requireLogin, checkAccessToken, async (req, res) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});
        const selectedChar = JSON.parse(localStorage.getItem("selectedChar"));

        if(selectedChar === null) {
            res.send(null);
            return;
        }

        const coreSettings = new CoreSettings();
        await coreSettings.initialize();
        const seasonalChallengesHash = coreSettings.getSeasonalChallengesHash();
        const seasonHash = coreSettings.getCurrentSeasonHash();

        const manifest = new Manifest(currentUser.accessToken.access_token);
        
        //get season info
        const seasonInfo = manifest.getSeasonInfo(seasonHash);

        //get challenges
        const seasonalChallengesData = manifest.getPresentationNodeInfo(seasonalChallengesHash);
        const weeklyInfo = manifest.getPresentationNodeInfo(seasonalChallengesData.children.presentationNodes[0].presentationNodeHash);

        //get progress for character
        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/Character/${selectedChar.characterID}/?components=900`;
        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving characters' });
        }
        const characterRecords = await response.json();
        if (!characterRecords.Response.hasOwnProperty("records")) {
            res.send(null);
        }
        const recordsData = characterRecords.Response.records.data.records;

        const allSeasonalChallengesInfo = weeklyInfo.children.presentationNodes.map(node => {
            //get presentation node data for all challenges in each week
            const weekCategoryInfo = manifest.getPresentationNodeInfo(node.presentationNodeHash);
            const categoryData = weekCategoryInfo.children.records.map(record => {
                const recordInfo = manifest.getRecordInfo(record.recordHash);

                //get objective info
                let allObjectiveData = null;
                if (recordInfo.hasOwnProperty("objectiveHashes")) {
                    allObjectiveData = recordInfo.objectiveHashes.map(objectiveHash => {
                        const objectiveInfo = manifest.getObjectiveInfo(objectiveHash);
    
                        //match progress to objective
                        for (let i=0; i<recordsData[record.recordHash].objectives.length; i++) {
                            const currObj = recordsData[record.recordHash].objectives[i];
                            if (currObj.objectiveHash === objectiveHash) {
                                return {
                                    objectiveInfo,
                                    objectiveProgress: currObj
                                };
                            }
                        };
    
                        return objectiveInfo;
                    });
                }
                
                //get rewards info
                let rewardData = null;
                if (recordInfo.hasOwnProperty("rewardItems")) {
                    rewardData = recordInfo.rewardItems.map(({itemHash, quantity}) => {
                        const rewardInfo = manifest.getItemInfo(itemHash);
                        return {
                            rewardInfo,
                            quantity
                        };
                    });
                }
                return {
                    recordInfo,
                    rewardData,
                    allObjectiveData
                };
            });
            return {
                weekCategoryInfo,
                categoryData
            };
        });
    
        res.send({
            seasonInfo,
            seasonalChallengesData,
            allSeasonalChallengesInfo
        });
    });

    app.get('/api/hide_seasonal_challenges', (req, res) => {
        if (!JSON.parse(localStorage.getItem('hide_seasonal_challenges'))) {
            localStorage.setItem('hide_seasonal_challenges', JSON.stringify(true));
        } else {
            localStorage.setItem('hide_seasonal_challenges', JSON.stringify(false));
        }
        res.send(JSON.parse(localStorage.getItem('hide_seasonal_challenges')));
    });

    app.get('/api/season_artifact', requireLogin, checkAccessToken, async (req, res) => {
        const coreSettings = new CoreSettings();
        await coreSettings.initialize();
        const seasonHash = coreSettings.getCurrentSeasonHash();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});
        
        const manifest = new Manifest(currentUser.accessToken.access_token);
        const seasonInfo = manifest.getSeasonInfo(seasonHash);
        const artifactInfo = manifest.getItemInfo(seasonInfo.artifactItemHash);

        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/?components=104`;
        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving profile progression' });
        }
        const profileProgression = await response.json();
        const seasonalArtifactProgression = profileProgression.Response.profileProgression.data.seasonalArtifact;

        res.send({
            artifactInfo,
            seasonalArtifactProgression
        });
    });

    app.get('/api/season_pass', requireLogin, checkAccessToken, async (req, res) => {
        const coreSettings = new CoreSettings();
        await coreSettings.initialize();
        const seasonHash = coreSettings.getCurrentSeasonHash();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});

        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/?components=202`;
        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving character progressions' });
        }
        const characterProgressions = await response.json();

        const manifest = new Manifest(currentUser.accessToken.access_token);
        const seasonInfo = manifest.getSeasonInfo(seasonHash);
        const seasonPassInfo = manifest.getSeasonPassInfo(seasonInfo.seasonPassHash);
        
        const seasonPassProgression = Object.values(characterProgressions.Response.characterProgressions.data)[0].progressions[seasonInfo.seasonPassProgressionHash];
        const prestigeSeasonPassProgression = Object.values(characterProgressions.Response.characterProgressions.data)[0].progressions[seasonPassInfo.prestigeProgressionHash];

        res.send({
            seasonPassProgression,
            prestigeSeasonPassProgression
        });
    });
}