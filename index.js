const express = require('express');
const mongoose = require('mongoose');
var LocalStorage = require('node-localstorage').LocalStorage;
const keys = require('./config/keys');
const checkForNewManifestVersion = require('./services/manifestChecker');

require('./models/User');
require('./models/lostSectorIndex');
require('./models/altarsOfSorrowRewards');
require('./models/wellspringIndex');
require('./models/nightfallWeaponRotation');
require('./models/nightmareHuntsRotation');
require('./models/empireHuntRotation');
require('./models/dreamingCityRotations');
require('./models/raidAndDungeonRotations');

mongoose.connect(keys.mongoURI);

const app = express();

localStorage = new LocalStorage('./scratch');

checkForNewManifestVersion().then(() => {
  app.use(express.json());
  require('./routes/authRoutes')(app);
  require('./routes/manifestRoutes')(app);
  require('./routes/characterRoutes')(app);
  require('./routes/vendorRoutes')(app);
  require('./routes/activityRoutes')(app);
  require('./routes/recordsRoutes')(app);

  if (process.env.NODE_ENV === 'production') {
    //ensure Express serves up production assets
    app.use(express.static('client/build'));
  
    //Express will serve index.html file if route not recognized, for react-router to handle
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT);
});

//check manifest version every 10 minutes
var manifestInterval = setInterval(() => checkForNewManifestVersion(), 60*10000);