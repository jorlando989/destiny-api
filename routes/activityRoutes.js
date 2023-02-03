const keys = require("../config/keys");
const mongoose = require("mongoose");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));
const requireLogin = require("../middlewares/requireLogin");
const checkAccessToken = require("../middlewares/checkAccessToken");

const DamageTypes = require("../data/damageTypes");
const BreakerTypes = require("../data/breakerTypes");
const Classes = require("../data/classTypes");
const WeeklyClanEngramRewards = require("../data/weeklyClanEngramRewards");

const lostSectorRotation = require("../data/lostSectorRotation.json");
const lostSectorRewardRotation = require("../data/lostSectorRewardRotation.json");
const allLostSectorHashes = require("../data/allLostSectorHashes.json");
const altarsOfSorrowRewardHashes = require("../data/altarsOfSorrowRotation.json");
const wellspringRotationHashes = require('../data/wellspringRotation.json');

const Manifest = require("../services/manifest");
const User = mongoose.model("users");
const LostSectorIndexes = mongoose.model("lostSectorIndex");
const AltarsOfSorrowRotation = mongoose.model("altarsOfSorrowRotation");
const WellspringRotation = mongoose.model('wellspringRotation');

module.exports = app => {
	app.get("/api/challenges", requireLogin, checkAccessToken, async (req, res) => {
		const currentUser = JSON.parse(localStorage.getItem("currentUser"));
		const userInfo = await User.findOne({
			membershipID: currentUser.accessToken.membership_id,
		});

		const response = await fetch(
			"https://www.bungie.net/Platform/Destiny2/Milestones/",
			{
				headers: {
					"X-API-Key": keys.apiKey,
					Authorization: currentUser.accessToken.access_token,
				},
			}
		);
		if (response.status === 400 || response.status === 401) {
			return res
				.status(401)
				.send({ error: "error retrieving weekly activities" });
		}
		const milestones = await response.json();

		const query = `https://www.bungie.net/Platform/Destiny2/${userInfo.profiles[0].membershipType}/Profile/${userInfo.profiles[0].membershipId}/?components=202,200`;
		const response2 = await fetch(query, {
			headers: {
				"X-API-Key": keys.apiKey,
				Authorization:
					"Bearer " + currentUser.accessToken.access_token,
			},
		});
		if (response2.status === 400 || response2.status === 401) {
			return res
				.status(401)
				.send({ error: "error retrieving character progressions" });
		}
		const resp = await response2.json();
		const characterProgressions = resp.Response.characterProgressions.data;
		const characters = resp.Response.characters.data;

		const manifest = new Manifest();

		//get class name for each character
		const charProgressAndClass = Object.entries(characterProgressions).map(entry => {
			return {
				class: Classes[characters[entry[0]].classType],
				progression: entry[1].milestones,
			};
		});

		const activityInfo = Object.values(milestones.Response).map(milestone => {
			const milestoneInfo = manifest.getMilestoneInfo(
				milestone.milestoneHash
			);

			//only include weekly milestones
			if (milestoneInfo.milestoneType != 3) {
				return null;
			}

			let activitiesInfo = null;
			if (milestone.hasOwnProperty("activities")) {
				activitiesInfo = milestone.activities.map(activity => {
					const activityInfo = manifest.getActivityInfo(activity.activityHash);
					return activityInfo;
				});
			}

			//get rewards info from various sources
			let questRewardsInfo = null;
			let activityRewardsInfo = null;
			let challengeRewardInfo = null;
			let milestoneRewards = null;
			if (milestoneInfo.rewards) {
				milestoneRewards = Object.values(milestoneInfo.rewards).map(reward => {
					const rewardEntriesInfo = Object.values(reward.rewardEntries).map(entry => {
						const entryInfo = entry.items.map(item => {
							const itemInfo = manifest.getItemInfo(item.itemHash);
							return itemInfo;
						});
						return {
							entry,
							entryInfo,
						};
					});
					return {
						rewardEntriesInfo,
						reward,
					};
				});
			}
			if (activitiesInfo) {
				activityRewardsInfo = activitiesInfo.map(activityInfo => {
					//check rewards
					if (activityInfo.rewards.length === 0) {
						return null;
					}
					//go through rewards list for each activity
					const activityRewards = activityInfo.rewards.map(rewardItems => {
						//go through each reward in reward list and get the items info
						const rewardsListInfo = rewardItems.rewardItems.map(item => {
							const rewardData = manifest.getItemInfo(item.itemHash);
							return { rewardData };
						});
						return { rewardsListInfo };
					});
					return { activityInfo, activityRewards };
				});
				activityRewardsInfo = activityRewardsInfo.filter(
					activity => activity !== null
				);

				//check challenges
				let challengeRewardInfo = activitiesInfo.map(activityInfo => {
					if (activityInfo.challenges.length === 0) {
						return null;
					}
					const challengesInfo = activityInfo.challenges.map(challenge => {
						const objectiveInfo = manifest.getObjectiveInfo(challenge.objectiveHash);

						//get info for objective's dummy rewards
						const dummyRewardsInfo = challenge.dummyRewards.map(dummyReward => {
							const dummyInfo = manifest.getItemInfo(dummyReward.itemHash);
							return { dummyInfo };
						});
						return {
							objectiveInfo,
							dummyRewardsInfo,
						};
					});
					return { challengesInfo };
				});
				challengeRewardInfo = challengeRewardInfo.filter(activity => activity !== null);
				//remove duplicates
				challengeRewardInfo = Array.from(
					new Set(challengeRewardInfo.map(a => a.id))
				).map(id => {
					return challengeRewardInfo.find(a => a.id === id);
				});
			}
			if (milestoneInfo.quests) {
				//get data for each reward of each associated quest
				let questRewardsInfo = Object.values(milestoneInfo.quests).map(quest => {
					if (!quest.questRewards) {
						return null;
					}
					const rewardInfo = quest.questRewards.items.map(item => {
						const itemInfo = manifest.getItemInfo(item.itemHash);
						return { itemInfo };
					});
					return { rewardInfo };
				});
				questRewardsInfo = questRewardsInfo.filter(
					reward => reward !== null
				);
			}

			return {
				milestoneInfo,
				milestoneRewards,
				activitiesInfo,
				questRewardsInfo,
				activityRewardsInfo,
				challengeRewardInfo,
				startDate: milestone.startDate, //might not exist
				endDate: milestone.endDate, //might not exist
			};
		});

		const filteredActivityInfo = activityInfo
			.filter(activity => activity !== null)
			.sort((a, b) => {
				const x = a.milestoneInfo.displayProperties.name.toLowerCase();
				const y = b.milestoneInfo.displayProperties.name.toLowerCase();
				if (x < y) return -1;
				if (x > y) return 1;
				return 0;
			});

		res.send({
			activities: filteredActivityInfo,
			charProgressAndClass,
			WeeklyClanEngramRewards,
		});
	});

	app.get("/api/hide_weekly_activities", (req, res) => {
		if (!localStorage.getItem("hide_weekly_activities")) {
			//when not set yet
			res.send(null);
		}
		localStorage.setItem("hide_weekly_activities", req.query.id);
		res.send(localStorage.getItem("hide_weekly_activities"));
	});

	app.get("/api/lost_sector", requireLogin, checkAccessToken,
		async (req, res) => {
			//get todays lost sector name
			const currLostSector = await LostSectorIndexes.findOne({numLostSectors: 11});
			
			const manifest = new Manifest();

			//get info for lost sector
			const currLostSectorName = lostSectorRotation.rotation[currLostSector.currLostSectorIndex];
			const currLostSectorHashes = allLostSectorHashes[currLostSectorName];

			const masterInfo = manifest.getActivityInfo(currLostSectorHashes.master);
			const legendInfo = manifest.getActivityInfo(currLostSectorHashes.legend);

			//get modifier info
			const masterModifiers = masterInfo.modifiers.map(({activityModifierHash}) => {
				const modifierInfo = manifest.getActivityModifierInfo(activityModifierHash);
				return modifierInfo;
			});

			const legendModifiers = legendInfo.modifiers.map(({activityModifierHash}) => {
				const modifierInfo = manifest.getActivityModifierInfo(activityModifierHash);
				return modifierInfo;
			});

			//filter hidden modifiers
			const filteredMasterModifiers = masterModifiers.filter(mod => {
				return (mod.displayInNavMode && mod.displayProperties.name !== "");
			});
			const filteredLegendModifiers = legendModifiers.filter(mod => {
				return (mod.displayInNavMode && mod.displayProperties.name !== "");
			});

			//set curr reward name
			const currReward = lostSectorRewardRotation.rotation[currLostSector.currLostSectorRewardIndex];

			//get reward info
			const masterRewards = masterInfo.rewards.map(({rewardItems}) => {
				const rewardInfo = manifest.getItemInfo(rewardItems[0].itemHash);
				return rewardInfo;
			});

			const legendRewards = legendInfo.rewards.map(({rewardItems}) => {
				const rewardInfo = manifest.getItemInfo(rewardItems[0].itemHash);
				return rewardInfo;
			});

			res.send({
				currLostSector: currLostSectorName,
				currReward,
				masterInfo,
				masterModifiers: filteredMasterModifiers,
				masterRewards,
				legendInfo,
				legendModifiers: filteredLegendModifiers,
				legendRewards,
				DamageTypes,
				BreakerTypes,
			});
		}
	);

	app.get("/api/altarsOfSorrow", requireLogin, checkAccessToken, async (req, res) => {
		const altarsOfSorrowDB = await AltarsOfSorrowRotation.findOne({altarRewardIndex: {$gte: 0}});

		const currReward = altarsOfSorrowRewardHashes.rotation[altarsOfSorrowDB.altarRewardIndex];
		const currRewardInfo = altarsOfSorrowRewardHashes[currReward];

		const manifest = new Manifest();
		const rewardInfo = manifest.getItemInfo(currRewardInfo.hash);

		res.send({
			rewardInfo
		});
	});

	app.get("/api/wellspring", requireLogin, checkAccessToken, async (req, res) => {
		const wellspringDB = await WellspringRotation.findOne({currRotationIndex: {$gte: 0}});

		const currRotation = wellspringRotationHashes.rotation[wellspringDB.currRotationIndex];

		const manifest = new Manifest();
		const activityInfo = manifest.getActivityInfo(wellspringRotationHashes[currRotation].activityHash);
		const rewardInfo = manifest.getItemInfo(wellspringRotationHashes[currRotation].weaponHash);

		const activityRewards = activityInfo.rewards.map(({rewardItems}) => {
			const rewards = rewardItems.map(reward => {
				const rewardData = manifest.getItemInfo(reward.itemHash);
				return rewardData;
			});
			return rewards;
		});

		res.send({
			activityInfo,
			activityRewards,
			rewardInfo
		});
	});
};
