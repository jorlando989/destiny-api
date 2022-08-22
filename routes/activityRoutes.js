const keys = require('../config/keys');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const requireLogin = require('../middlewares/requireLogin');
const checkAccessToken = require('../middlewares/checkAccessToken');
const Manifest = require('../services/manifest');

module.exports = app => {
    app.get("/api/challenges", requireLogin, checkAccessToken, async (req, res) => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const response = await fetch('https://www.bungie.net/Platform/Destiny2/Milestones/', {
            headers: {
                'X-API-Key': keys.apiKey,
                'Authorization': currentUser.accessToken.access_token
            }
        });
        if (response.status === 400 || response.status === 401) {
            return res.status(401).send({ error: 'error retrieving weekly activities' });
        }
        const milestones = await response.json();

        const manifest = new Manifest(currentUser.accessToken.access_token);

        const milestoneData = Object.values(milestones.Response).map(async milestone => {
            const milestoneInfo = await manifest.getMilestoneInfo(milestone.milestoneHash);

            //only include weekly milestones
            if(milestoneInfo.milestoneType != 3) {
                return null;
            }

            let activitiesInfo = null;
            if (milestone.hasOwnProperty('activities')) {
                const activitiesData = milestone.activities.map(async activity => {
                    const activityInfo = await manifest.getActivityInfo(activity.activityHash);
                    return { activityInfo };
                });
                activitiesInfo = await Promise.all(activitiesData);
            }

            //get rewards info from various sources
            let questRewardsInfo = null;
            let activityRewardsInfo = null;
            let challengeRewardInfo = null;
            let milestoneRewards = null;
            if (milestoneInfo.rewards) {
                const milestoneRewardsData = Object.values(milestoneInfo.rewards).map(async reward => {
                    const rewardEntriesData = Object.values(reward.rewardEntries).map(async entry => {
                        const entryData = entry.items.map(async item => {
                            const itemInfo = await manifest.getItemInfo(item.itemHash);
                            return itemInfo;
                        });
                        const entryInfo = await Promise.all(entryData);
                        return {
                            entry,
                            entryInfo
                        };
                    });
                    const rewardEntriesInfo = await Promise.all(rewardEntriesData);
                    return {
                        rewardEntriesInfo,
                        reward
                    };
                });
                milestoneRewards = await Promise.all(milestoneRewardsData);
            }
            if (activitiesInfo) {
                const activityRewardsData = activitiesInfo.map(async ({activityInfo}) => {
                    //check rewards
                    if (activityInfo.rewards.length === 0) {
                        return null;
                    }
                    //go through rewards list for each activity
                    const activityRewardsData = activityInfo.rewards.map(async ({rewardItems}) => {
                        //go through each reward in reward list and get the items info
                        const rewardsListData = rewardItems.map(async item => {
                            const rewardData = await manifest.getItemInfo(item.itemHash);
                            return {rewardData};
                        });
                        const rewardsListInfo = await Promise.all(rewardsListData);
                        return {rewardsListInfo};
                    });
                    const activityRewards = await Promise.all(activityRewardsData);
                    return {activityInfo, activityRewards};
                });
                activityRewardsInfo = await Promise.all(activityRewardsData);
                activityRewardsInfo = activityRewardsInfo.filter(activity => activity !== null);

                //check challenges
                const challengesRewardsData = activitiesInfo.map(async ({activityInfo}) => {
                    if (activityInfo.challenges.length === 0) {
                        return null;
                    }
                    const challengesData = activityInfo.challenges.map(async challenge => {
                        const objectiveInfo = await manifest.getObjectiveInfo(challenge.objectiveHash);

                        //get info for objective's dummy rewards
                        const dummyRewardsData = challenge.dummyRewards.map(async dummyReward => {
                            const dummyInfo = await manifest.getItemInfo(dummyReward.itemHash);
                            // console.log(activityInfo.displayProperties.name, dummyInfo.displayProperties.name);
                            return {dummyInfo};
                        });
                        const dummyRewardsInfo = await Promise.all(dummyRewardsData);

                        return {
                            objectiveInfo,
                            dummyRewardsInfo
                        };
                    });
                    const challengesInfo = await Promise.all(challengesData);
                    return {challengesInfo};
                });
                challengeRewardInfo = await Promise.all(challengesRewardsData);
                challengeRewardInfo = challengeRewardInfo.filter(activity => activity !== null);
                //remove duplicates
                challengeRewardInfo = Array.from(new Set(challengeRewardInfo.map(a => a.id)))
                    .map(id => {
                        return challengeRewardInfo.find(a => a.id === id)
                    });
            }
            if (milestoneInfo.quests) {
                //get data for each reward of each associated quest
                const questsData = Object.values(milestoneInfo.quests).map(async quest => {
                    if (!quest.questRewards) {
                        return null;
                    }
                    const rewardData = quest.questRewards.items.map(async item => {
                        const itemInfo = await manifest.getItemInfo(item.itemHash);
                        return {itemInfo};
                    });
                    const rewardInfo = await Promise.all(rewardData);
                    return {rewardInfo};
                });
                questRewardsInfo = await Promise.all(questsData);
                questRewardsInfo = questRewardsInfo.filter(reward => reward !== null);
            }

            return {
                milestoneInfo,
                milestoneRewards,
                activitiesInfo,
                questRewardsInfo,
                activityRewardsInfo,
                challengeRewardInfo,
                startDate: milestone.startDate,  //might not exist
                endDate: milestone.endDate       //might not exist
            };
        });
        const activityInfo = await Promise.all(milestoneData);

        const filteredActivityInfo = activityInfo.filter(activity => activity !== null).sort((a,b) => {
            const x = a.milestoneInfo.displayProperties.name.toLowerCase();
            const y = b.milestoneInfo.displayProperties.name.toLowerCase();
            if (x < y) { return -1 }
            if (x > y) { return 1 }
            return 0;
        });

        res.send(filteredActivityInfo);
    });
}