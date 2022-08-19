const keys = require('../config/keys');
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const requireLogin = require('../middlewares/requireLogin');
const checkAccessToken = require('../middlewares/checkAccessToken');
const Manifest = require('../services/manifest');
const User = mongoose.model('users');

module.exports = app => { 
    //add back in checkAccessToken
    app.get("/api/vendors", requireLogin, checkAccessToken, async (req, res) => {
        //not being called on dropdown selection - !!
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userInfo = await User.findOne({membershipID: currentUser.accessToken.membership_id});
        const selectedChar = JSON.parse(localStorage.getItem("selectedChar"));

        console.log("api selected char", selectedChar);

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

        const manifest = new Manifest(currentUser.accessToken.access_token);

        const vendorGroupsInfo = vendorGroupHashes.groups.map(async group => {
            //get info for group
            const vendorGroup = await manifest.getVendorGroupInfo(group.vendorGroupHash);

            //get info for each vendor in group
            const groupInfo = group.vendorHashes.map(async vendor => {
                const vendorInfo = await manifest.getVendorInfo(vendor);

                //get info for vendors location
                const locationInfo = vendorInfo.locations.map(async location => {
                    const destination = await manifest.getLocationInfo(location.destinationHash);
                    return { 
                        displayProperties: destination.displayProperties,
                        hash: destination.hash
                     };
                });
                const locationResults = await Promise.all(locationInfo);

                //get info for sale items and associated with correct vendor
                const saleHashes = vendorSales[vendor];
                const saleInfo = Object.values(saleHashes.saleItems).map(async ({itemHash, quantity, vendorItemIndex, costs}) => {
                    const itemInfo = await manifest.getItemInfo(itemHash);
                    return {
                        quantity,
                        itemInfo,
                        itemHash,
                        vendorItemIndex,
                        costs
                    };
                });
                const saleResults = await Promise.all(saleInfo);

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
            const groupResults = await Promise.all(groupInfo);

            return {
                vendorGroup,
                groupInfo: groupResults
            };
        });
        const vendorGroupResults = await Promise.all(vendorGroupsInfo);

        res.send(vendorGroupResults);
    });
}