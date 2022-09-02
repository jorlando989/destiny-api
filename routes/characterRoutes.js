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
        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/?components=100`;

        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving characters' });
        }
        const characters = await response.json();

        const charactersData = characters.Response.profile.data.characterIds.map(async charID => {
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

        const parsedCharData = await Promise.all(charactersInfo.map(async char => {
            return {
                characterID: char.characterId,
                class: await manifest.getClassInfo(char.classHash),
                race: await manifest.getRaceInfo(char.raceHash),
                lightLevel: char.light,
                emblemFull: char.emblemBackgroundPath,
                emblemIcon: char.emblemPath
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
}