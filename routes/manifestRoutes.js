const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const requireLogin = require('../middlewares/requireLogin');
const checkAccessToken = require('../middlewares/checkAccessToken');
const checkForNewManifestVersion = require('../services/manifestChecker');

module.exports = app => { 
    app.get('/api/checkForManifestUpdate', requireLogin, checkAccessToken,async (req, res) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const currVersion = await checkForNewManifestVersion(currentUser.accessToken.access_token);
        res.send(currVersion);
    });
}