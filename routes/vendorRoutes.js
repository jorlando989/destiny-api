const keys = require('../config/keys');
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const requireLogin = require('../middlewares/requireLogin');
const checkAccessToken = require('../middlewares/checkAccessToken');

const Manifest = require('../services/manifest');
const User = mongoose.model('users');

const vendorModsHashes = require('../data/vendorModsHashes.json');

const rankProgressionToStreakProgression = {
    2083746873: '2203850209',     //crucible
    3008065600: '2939151659',     //gambit
    457612306: '600547406',       //vanguard
    2755675426: '70699614',       //trials
    527867935: '1999336308'       //strange favor (dares)
};

module.exports = app => {
    app.get("/api/vendors", requireLogin, checkAccessToken, async (req, res) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});
        const selectedChar = JSON.parse(localStorage.getItem("selectedChar"));

        if(selectedChar === null) {
            res.send(null);
            return;
        }

        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/Character/${selectedChar.characterID}/Vendors/?components=400,401,402`;

        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving vendors' });
        }
        const respData = await response.json();

        const vendorGroupHashes = respData.Response.vendorGroups.data;
        const vendorCategories = respData.Response.categories.data;
        const vendorSales = respData.Response.sales.data;

        const manifest = new Manifest();

        const vendorGroupResults = vendorGroupHashes.groups.map(group => {
            //get info for group
            const vendorGroup = manifest.getVendorGroupInfo(group.vendorGroupHash);

            //get info for each vendor in group
            const groupResults = group.vendorHashes.map(vendor => {
                const vendorInfo = manifest.getVendorInfo(vendor);

                //get info for vendors location
                const locationResults = vendorInfo.locations.map(location => {
                    const destination = manifest.getLocationInfo(location.destinationHash);
                    return { 
                        displayProperties: destination.displayProperties,
                        hash: destination.hash
                     };
                });

                //get info for sale items and associated with correct vendor
                const saleHashes = vendorSales[vendor];
                const saleResults = Object.values(saleHashes.saleItems).map( ({itemHash, quantity, vendorItemIndex, costs}) => {
                    const itemInfo = manifest.getItemInfo(itemHash);
                    return {
                        quantity,
                        itemInfo,
                        itemHash,
                        vendorItemIndex,
                        costs
                    };
                });

                //user vendorInfo.displayCategories to group
                //in each list of vendor display categories, match the indexes to vendoritemindex on each item to get matching category
                const currVendorGroups = vendorInfo.displayCategories;
                const currVendorCategories = vendorCategories[vendorInfo.hash].categories;

                const groupedItems = {};
                saleResults.forEach(item => {
                    //check item.vendorItemIndex and compare to each vendorCategory and put in right group
                    //use currVendorGroups to get group info
                    currVendorCategories.forEach(category => {
                        category.itemIndexes.forEach(itemIndex => {
                            if (item.vendorItemIndex === itemIndex) {
                                if (groupedItems.hasOwnProperty(category.displayCategoryIndex)) {
                                    groupedItems[category.displayCategoryIndex].push(item);
                                } else {
                                    groupedItems[category.displayCategoryIndex] = [item];
                                }
                            }
                        });
                    });
                });

                //get itemBucket info for groups
                const groupedItemsInfo = Object.entries(groupedItems).map(group => {
                    let bucketInfo = null;
                    currVendorGroups.forEach(currGroup => {
                        if(currGroup.index == group[0]) {
                            bucketInfo = currGroup;
                        }
                    });
                    return {
                        bucketInfo,
                        group: group[1]
                    };
                });
                
                return {
                    vendor,
                    vendorInfo,
                    locationInfo: locationResults,
                    saleInfo: groupedItemsInfo
                };
            });

            return {
                vendorGroup,
                groupInfo: groupResults
            };
        });

        res.send(vendorGroupResults);
    });

    app.get('/api/vendor_ranks', requireLogin, checkAccessToken, async (req, res) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});
        const selectedChar = JSON.parse(localStorage.getItem("selectedChar"));

        if(selectedChar === null) {
            res.send(null);
            return;
        }

        //get vendor rank information
        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/Character/${selectedChar.characterID}/Vendors/?components=400`;
        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving vendors' });
        }
        const respData = await response.json();
        const vendors = respData.Response.vendors.data;

        //filter for vendors with progress
        const rankVendorsData = Object.values(vendors).filter(vendor => {
            return vendor.hasOwnProperty('progression');
        });

        //get progression for selected character
        const query2 = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/Character/${selectedChar.characterID}/?components=202`;
        const response2 = await fetch(query2, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + currentUser.accessToken.access_token
            }
        });
        if (response2.status === 400 || response2.status === 401) {
            return res.status(401).send({ error: 'error retrieving vendors' });
        }
        const respData2 = await response2.json();
        const characterProgressionData = respData2.Response.progressions.data.progressions;

        //get streak info for relevant vendors
        const rankVendors = rankVendorsData.map(vendor => {
            if (vendor.progression.progressionHash in rankProgressionToStreakProgression) {
                return {
                    vendor,
                    progressInfo: characterProgressionData[rankProgressionToStreakProgression[vendor.progression.progressionHash]]
                }
            } else {
                return {vendor}
            }
        });

        const manifest = new Manifest(currentUser.accessToken.access_token);
        
        const progressionInfo = rankVendors.map(({vendor, progressInfo}) => {
            const rankInfo = manifest.getProgressionInfo(vendor.progression.progressionHash);
            return {
                rankInfo,
                vendor,
                progressInfo
            };
        });

        //add competitive division rank
        const competitiveDivisionData = characterProgressionData['3696598664'];
        const rankInfo = manifest.getProgressionInfo(competitiveDivisionData.progressionHash);
        progressionInfo.push({
            rankInfo,
            vendor: {progression: competitiveDivisionData}
        });

        res.send(progressionInfo);
    });

    app.get('/api/fetch_vendor_mods', requireLogin, checkAccessToken, async (req, res) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});
        const selectedChar = JSON.parse(localStorage.getItem("selectedChar"));

        if(selectedChar === null) {
            res.send(null);
            return;
        }

        //get vendor sales
        const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/Character/${selectedChar.characterID}/Vendors/${vendorModsHashes[req.query.vendor].hash}/?components=402`;

        const response = await fetch(query, {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': "Bearer " + currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving vendors' });
        }
        const respData = await response.json();
        let vendorSales = null;
        if (respData.Response.sales.data) {
            vendorSales = respData.Response.sales.data;
        } else {
            res.send();
        }

        const manifest = new Manifest();

        const vendorSalesInfo = Object.values(vendorSales).map(item => {
            return manifest.getItemInfo(item.itemHash);
        });

        //filter for mods 
        const filteredVendorSalesInfo = vendorSalesInfo.filter((item) => {
            return item.itemCategoryHashes.includes(59);
        });

        res.send(filteredVendorSalesInfo);
    });
}