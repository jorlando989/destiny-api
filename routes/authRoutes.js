const keys = require('../config/keys');
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const User = mongoose.model('users');

module.exports = app => {    
    app.get('/auth/bungie', (req, res) => {
        //request access token from bungie
        res.redirect(`https://www.bungie.net/en/OAuth/Authorize?client_id=${keys.clientID}&response_type=code`);
    });
    
    app.get('/auth/bungie/callback',  async (req, res) => {
        //get access token
        const resp = await fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
            method: 'POST',
            headers: {
                'X-API-Key': keys.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': keys.clientID,
                'client_secret': keys.clientSecret,
                'grant_type': "authorization_code",
                'code': req.query.code
            })
        });
        if (resp.status === 400 || resp.status === 401) {
            return res.status(401).send({ error: 'error retrieving auth token' });
        }
        const accessToken = await resp.json();
        const accessTokenObj = {
            accessToken,
            timeRecieved: new Date().getTime()
        };

        //get membership profile
        const allProfilesResp = await fetch(
            `https://www.bungie.net/Platform/Destiny2/2/Profile/${accessToken.membership_id}/LinkedProfiles/?getAllMemberships=true`,
            {
                headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': accessToken
            }
        });
        if (allProfilesResp.status === 400 || allProfilesResp.status === 401) {
            return res.status(401).send({ error: 'error retrieving user membership profiles' });
        }
        const profiles = await allProfilesResp.json();

        //save user if new
        const existingUser = await User.findOne({membershipID: accessToken.membership_id});
        if (!existingUser) {
            await new User({
                accessToken: accessTokenObj,
                membershipID: accessToken.membership_id,
                profiles: profiles.Response.profiles.map(
                    ({dateLastPlayed, membershipType, membershipId, displayName, bungieGlobalDisplayName, bungieGlobalDisplayNameCode}) => {
                        return {
                            dateLastPlayed,
                            membershipType,
                            membershipId,
                            displayName,
                            bungieGlobalDisplayName,
                            bungieGlobalDisplayNameCode
                        };
                    }
                )
            }).save((err, user) => {
                if (err) return console.error(err);
                console.log(user.accessToken + " saved to users collection.");
            });
        }
        //save user in local storage
        localStorage.setItem('currentUser', JSON.stringify(accessTokenObj));
        res.redirect(keys.loginRedirectURL);
        return;
    });

    app.get('/api/current_user', (req, res) => {
        //get current user if one is logged in
        res.send(localStorage.getItem('currentUser'));
    });

    app.get('/api/logout', (req, res) => {
        localStorage.clear();
        res.redirect('/');
    });
};