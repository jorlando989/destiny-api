const keys = require('../config/keys');
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const requireLogin = require('../middlewares/requireLogin');
const checkAccessToken = require('../middlewares/checkAccessToken');

const Manifest = require('../services/manifest');
const User = mongoose.model('users');

module.exports = app => { 
    app.get("/api/characters", requireLogin, checkAccessToken, async (req, res) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});

        //choose which profile to use -- use first by default
        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/?components=100,900`;

        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving characters' });
        }
        const resp = await response.json();
        const profileRecords = resp.Response.profileRecords.data.records;

        const charactersData = resp.Response.profile.data.characterIds.map(async charID => {
            const charQuery = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/Character/${charID}/?components=200`;

            const resp = await fetch(charQuery, {
                headers: {
                    'X-API-Key': keys.apiKey,
                    'Authorization': currentUser.access_token
                }
            });
            if (response.status === 400 || response.status === 401) {
                return res.status(401).send({ error: 'error retrieving character info for ' + charID });
            }
            
            const charInfo = await resp.json();
            return charInfo.Response.character.data;
        });
        const charactersInfo = await Promise.all(charactersData);

        const manifest = new Manifest(currentUser.accessToken.access_token);

        const parsedCharData = await Promise.all(charactersInfo.map(async charInfo => {
            const classInfo = await manifest.getClassInfo(charInfo.classHash);
            const race = await manifest.getRaceInfo(charInfo.raceHash);
            const title = await manifest.getRecordInfo(charInfo.titleRecordHash);
            let gilded = false;
            if (title.titleInfo.hasOwnProperty('gildingTrackingRecordHash')) {
                const recordData = profileRecords[title.titleInfo.gildingTrackingRecordHash];
                if (recordData.objectives[0].complete) {
                    gilded = true;
                }
            }
            return {
                characterID: charInfo.characterId,
                class: classInfo,
                race,
                title,
                gilded,
                lightLevel: charInfo.light,
                emblemFull: charInfo.emblemBackgroundPath,
                emblemIcon: charInfo.emblemPath
            }
        }));
        const parsedCharInfo = await Promise.all(parsedCharData);
        res.send(parsedCharInfo);
    });

    app.get('/api/selected_char', (req, res) => {
        res.send(JSON.parse(localStorage.getItem("selectedChar")));
    });

    app.post('/api/select_char', (req, res) => {
        const selectedChar = req.body.selectedChar;
        localStorage.setItem("selectedChar", JSON.stringify(selectedChar));
        console.log('selected char set in local storage');
        res.send(selectedChar);
    });

    app.get('/api/bounties', requireLogin, checkAccessToken, async (req, res) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});
        const selectedChar = JSON.parse(localStorage.getItem("selectedChar"));

        if(selectedChar === null) {
            res.send(null);
            return;
        }

        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/Character/${selectedChar.characterID}/?components=201,301`;
        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': 'Bearer ' + currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving character inventory and itemObjectives' });
        }
        const resp = await response.json();
        const itemObjectives = resp.Response.itemComponents.objectives.data;
        const charInventory = resp.Response.inventory.data.items;
        const bounties = charInventory.filter(item => {
            return item.bucketHash === 1345459588;
        });

        const manifest = new Manifest(currentUser.accessToken.access_token);

        const bountiesInfo = bounties.map(async bounty => {
            const bountyData = await manifest.getItemInfo(bounty.itemHash);
            
            //get progress if applicable
            let objectivesData = null;
            if (itemObjectives[bounty.itemInstanceId]) {
                const objectivesInfo = itemObjectives[bounty.itemInstanceId].objectives.map(async obj => {
                    const objInfo = await manifest.getObjectiveInfo(obj.objectiveHash);
                    return {
                        obj,
                        objInfo
                    };
                });
                objectivesData = await Promise.all(objectivesInfo);
            }

            return {
                bounty,
                bountyData,
                objectivesData
            };
        });
        const bountiesData = await Promise.all(bountiesInfo);

        //sort into bounties, quests, and questItems
        const trueBounties = bountiesData.filter(item => {
            return item.bountyData.traitIds.includes('inventory_filtering.bounty');
        })
        const quests = bountiesData.filter(item => {
            return item.bountyData.traitIds.includes('inventory_filtering.quest')
                && item.bountyData.itemType !== 0;
        })
        const questItems = bountiesData.filter(item => {
            return item.bountyData.traitIds.includes('inventory_filtering.quest')
                && item.bountyData.itemType === 0;
        })

        res.send({
            bounties: trueBounties,
            quests,
            questItems
        });
    });
}