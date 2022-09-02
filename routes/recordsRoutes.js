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
        const seasonalChallengesData = await manifest.getPresentationNodeInfo(seasonalChallengesHash);

        //get season info
        const seasonInfo = await manifest.getSeasonInfo(seasonHash);

        //get challenges
        const weeklyInfo = await manifest.getPresentationNodeInfo(seasonalChallengesData.children.presentationNodes[0].presentationNodeHash);

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
        const recordsData = characterRecords.Response.records.data.records;

        const allSeasonalChallengesData = weeklyInfo.children.presentationNodes.map(async node => {
            //get presentation node data for all challenges in each week
            const weekCategoryInfo = await manifest.getPresentationNodeInfo(node.presentationNodeHash);
            const weekCategoryData = weekCategoryInfo.children.records.map(async record => {
                const recordInfo = await manifest.getRecordInfo(record.recordHash);

                //get objective info
                const allObjectiveInfo = recordInfo.objectiveHashes.map(async objectiveHash => {
                    const objectiveInfo = await manifest.getObjectiveInfo(objectiveHash);

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
                })
                const allObjectiveData = await Promise.all(allObjectiveInfo);

                //get rewards info
                const allRewardInfo = recordInfo.rewardItems.map(async ({itemHash, quantity}) => {
                    const rewardInfo = await manifest.getItemInfo(itemHash);
                    return {
                        rewardInfo,
                        quantity
                    };
                });
                const rewardData = await Promise.all(allRewardInfo);

                return {
                    recordInfo,
                    rewardData,
                    allObjectiveData
                };
            })
            const categoryData = await Promise.all(weekCategoryData);
            return {
                weekCategoryInfo,
                categoryData
            };
        });
        const allSeasonalChallengesInfo = await Promise.all(allSeasonalChallengesData);
    
        res.send({
            seasonInfo,
            seasonalChallengesData,
            allSeasonalChallengesInfo
        });
    });

    app.get('/api/hide_seasonal_challenges', (req, res) => {
        if (JSON.parse(localStorage.getItem('hide_seasonal_challenges'))) {
            localStorage.setItem('hide_seasonal_challenges', JSON.stringify(false));
        } else {
            localStorage.setItem('hide_seasonal_challenges', JSON.stringify(true));
        }
        res.send(JSON.parse(localStorage.getItem('hide_seasonal_challenges')));
    });
}