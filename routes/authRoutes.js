// import fetch from 'node-fetch';
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
                'grant_type': "authorization_code",
                'code': req.query.code
            }).toString()
        })
        const accessToken = await resp.json();
    
        //save user if new
        const existingUser = await User.findOne({membershipID: accessToken.membership_id});
        if (!existingUser) {
            const newUser = await new User({
                accessToken: accessToken,
                membershipType: '2',      //figure out how to actually get this
                membershipID: accessToken.membership_id
            }).save((err, user) => {
                if (err) return console.error(err);
                console.log(user.accessToken + " saved to users collection.");
            });
        }
        //save user in local storage
        localStorage.setItem('currentUser', accessToken);
    
        res.redirect(keys.loginRedirectURL);
    });

    app.get('/api/current_user', (req, res) => {
        //get current user if one is logged in
        res.send(localStorage.getItem('currentUser'));
    });

    app.get('/api/getUserProfileData', async (req, res) => {
        //get users profile info
        const query = `https://www.bungie.net/Platform/User/GetBungieNetUserById/${req.membership_id}/`;
        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': accessToken
            }
        })
        const userProfileData = await response.json();
        res.send(userProfileData);
    })

    app.get('/api/logout', (req, res) => {
        localStorage.clear();
        res.redirect('/');
    });
};