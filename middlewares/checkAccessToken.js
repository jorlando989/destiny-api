const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//need to refresh access token every hour
module.exports = async (req, res, next) => {
    if(localStorage.getItem('currentUser')) {
        const currUser = JSON.parse(localStorage.getItem('currentUser'));
        const now = new Date().getTime();
        const timePassed = (now - currUser.timeRecieved) / 1000;

        //if refresh token expired, redirect to /auth/bungie
        if (currUser.accessToken.refresh_expires_in <= timePassed + 60) {
            console.log("refresh token expired");
            res.redirect('/auth/bungie');
        } else if (currUser.accessToken.expires_in <= timePassed + 60) {  
            //if access token expired, get new access token using refresh token
            console.log("access token expired");
            const response = await fetch("https://www.bungie.net/Platform/App/OAuth/Token/", {
                method: 'POST',
                headers: {
                    'X-API-Key': keys.apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'client_id': keys.clientID,
                    'client_secret': keys.clientSecret,
                    'grant_type': "refresh_token",
                    'refresh_token': currUser.accessToken.refresh_token
                })
            });
            if (response.status === 400 || response.status === 401) {
                return res.status(401).send({ error: 'error retrieving new access token' });
            }

            const newAccessToken = await response.json();
            const newAccessObj = {
                accessToken: newAccessToken,
                timeRecieved: new Date().getTime()
            };

            User.updateOne(
                {membershipID: currUser.accessToken.membership_id}, 
                {accessToken: newAccessObj},
                (err, docs) => {
                    if (err){
                        console.log(err)
                    } else{
                        console.log("Updated User: ", docs);
                    }
                }
            );
            localStorage.setItem('currentUser', JSON.stringify(newAccessObj));
        }
    } else {
        return res.status(401).send({ error: 'You must log in!' });
    }
    next();
};