const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => { 
    app.get("/api/vendors", requireLogin, async (req, res) => {
        // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // const query = `https://www.bungie.net/Platform/Destiny2/2/Profile/${currentUser.membership_id}/Character/${characterID}/Vendors/?components=400,402`;
        
        // const {vendorGroups, vendors} = await fetch(query);
        // const response = await fetch(query, {
        //     headers: {
        //         'X-API-Key': keys.apiKey,
        //         'Authorization': accessToken
        //     }
        // });

        // res.send(vendors);
    });
}