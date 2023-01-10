const checkForNewManifestVersion = require('../services/manifestChecker');

module.exports = app => {
    app.get('/api/checkForManifestUpdate', async (req, res) => {
        const currVersion = await checkForNewManifestVersion();
        res.send(currVersion);
    });
}