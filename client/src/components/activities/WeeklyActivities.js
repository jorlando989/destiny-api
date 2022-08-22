import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchWeeklyActivities } from '../../actions';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

class WeeklyActivities extends Component {
    componentDidMount () {
        this.props.fetchWeeklyActivities();
    }

    renderMilestoneName(milestoneInfo, activitiesInfo) {
        if (milestoneInfo.displayProperties.name === "Weekly Dungeon Challenge") {
            return milestoneInfo.displayProperties.name + " - " + activitiesInfo[0].activityInfo.displayProperties.name;
        } else if (milestoneInfo.displayProperties.name === "Wellspring Powerful Challenge") {  
            return milestoneInfo.displayProperties.name + " - " + activitiesInfo[0].activityInfo.displayProperties.name;
        } else if (milestoneInfo.displayProperties.name === "Nightfall: The Ordeal Weekly Score" || milestoneInfo.displayProperties.name === "Nightfall: The Ordeal Weekly Completions") {
            return milestoneInfo.displayProperties.name + " - " + activitiesInfo[0].activityInfo.displayProperties.description;
        } else {
            return milestoneInfo.displayProperties.name;
        }
    }

    renderIcon(milestoneInfo) {
        if (milestoneInfo.displayProperties.hasIcon) {
            const imgSrc = `https://www.bungie.net${milestoneInfo.displayProperties.icon}`;
            return (
                <ListGroup.Item>
                    <img src={imgSrc} className="challengeIcon" alt="milestoneIcon" />
                </ListGroup.Item>
            );
        }
    }

    renderQuestRewards(questRewardsInfo) {
        if (questRewardsInfo && questRewardsInfo.length > 0) {
             return questRewardsInfo.map(({rewardInfo}) => {
                return rewardInfo.map(item => {
                    if (!item.itemInfo) {
                        return null;
                    }
                    const imgSrc = item.itemInfo.displayProperties.hasIcon ? `https://www.bungie.net${item.itemInfo.displayProperties.icon}` : null;
                    return (
                        <ListGroup.Item key={item.itemInfo.hash} className='rewardItem'>
                            <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                            {item.itemInfo.displayProperties.name}
                        </ListGroup.Item>
                    );
                });
            });
        }
    }

    renderActivityRewards(milestoneInfo, activityRewardsInfo) {
        if (activityRewardsInfo && activityRewardsInfo.length > 0) {
            let renderedContent = null;
            if (milestoneInfo.friendlyName === "MILESTONE_WEEKLY_NIGHTFALL" || milestoneInfo.friendlyName === "MILESTONE_WEEKLY_NIGHTFALL_SCORE") {
                renderedContent = activityRewardsInfo.map(({activityInfo, activityRewards}) => {
                    const renderedActivityRewards = activityRewards.map(({rewardsListInfo}) => {
                        return rewardsListInfo.map(({rewardData}) => {
                            const imgSrc = rewardData.displayProperties.hasIcon ? `https://www.bungie.net${rewardData.displayProperties.icon}` : null;
                            return (
                                <ListGroup.Item key={rewardData.hash} className='rewardItem'>
                                    <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                                    {rewardData.displayProperties.name}
                                </ListGroup.Item>
                            );
                        });
                    });
                    return (
                        <Tab key={activityInfo.hash} eventKey={activityInfo.hash} title={activityInfo.displayProperties.name}>
                            <ListGroup>
                                {renderedActivityRewards}
                            </ListGroup>
                        </Tab>
                    );
                });
                return (
                    <ListGroup.Item key={milestoneInfo.hash}>
                        <Tabs defaultActiveKey={activityRewardsInfo[0].activityInfo.hash} className="mb-3" justify>
                            {renderedContent}
                        </Tabs>
                    </ListGroup.Item>
                );
            } else {
                renderedContent = activityRewardsInfo.map(({activityInfo, activityRewards}) => {
                    const rewardContent = activityRewards.map(({rewardsListInfo}) => {
                        return rewardsListInfo.map(({rewardData}) => {
                            const imgSrc = rewardData.displayProperties.hasIcon ? `https://www.bungie.net${rewardData.displayProperties.icon}` : null;
                            return (
                                <ListGroup.Item key={rewardData.hash} className='rewardItem'>
                                    <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                                    {rewardData.displayProperties.name}
                                </ListGroup.Item>
                            );
                        });
                    });
                    return (
                        <ListGroup.Item key={activityInfo.hash}>
                            {activityInfo.displayProperties.name}
                            {rewardContent}
                        </ListGroup.Item>
                    );
                });
                return (
                    <ListGroup.Item key={milestoneInfo.hash}>
                        <ListGroup>
                            {renderedContent}
                        </ListGroup>
                    </ListGroup.Item>
                );
            }
        }
    }

    renderChallengeRewards(challengeRewardInfo) {
        if (challengeRewardInfo && challengeRewardInfo.length > 0) {
            let allRenderedContent = null;
            allRenderedContent = challengeRewardInfo.map(({challengesInfo}) => {
                return challengesInfo.map(challenge => {
                    return challenge.dummyRewardsInfo.map(({dummyInfo}) => {
                        const imgSrc = dummyInfo.displayProperties.hasIcon ? `https://www.bungie.net${dummyInfo.displayProperties.icon}` : null;
                        return (
                            <ListGroup.Item key={dummyInfo.hash} className="rewardItem">
                                <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                                {dummyInfo.displayProperties.name}
                            </ListGroup.Item>
                        );
                    });
                })
            });
            return (
                <ListGroup className="milestone">
                    {allRenderedContent}
                </ListGroup>
            );
        }
    }

    renderMilestoneRewards(milestoneRewards) {
        if (milestoneRewards) {
            return milestoneRewards.map(({reward, rewardEntriesInfo}) => {
                if (reward.categoryIdentifier === 'milestone_clan_current_week') {
                    return rewardEntriesInfo.map(({entry, entryInfo}) => {
                        const imgSrc = entryInfo[0].displayProperties.hasIcon ? `https://www.bungie.net${entryInfo[0].displayProperties.icon}` : null;
                        return (
                            <ListGroup.Item className='rewardItem' key={entry.rewardEntryHash}>
                                {entry.displayProperties.name}: <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                                {entryInfo[0].displayProperties.name}
                            </ListGroup.Item>
                        );
                    });
                } else if (reward.categoryIdentifier !== 'milestone_clan_past_week') {
                    return rewardEntriesInfo.map(({entry, entryInfo}) => {
                        const imgSrc = entryInfo[0].displayProperties.hasIcon ? `https://www.bungie.net${entryInfo[0].displayProperties.icon}` : null;
                        return (
                            <ListGroup.Item className='rewardItem' key={entry.rewardEntryHash}>
                                <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                                {entryInfo[0].displayProperties.name}
                            </ListGroup.Item>
                        );
                    });
                }
            });
        }
    }

    renderCorrectRewards(milestoneRewards, challengeRewardInfo, questRewardsInfo) {
        if (milestoneRewards) {
            return (
                <ListGroup.Item key='milestoneRewards'>
                    <ListGroup>
                        {this.renderMilestoneRewards(milestoneRewards)}
                    </ListGroup>
                </ListGroup.Item>
            );
        } else if (challengeRewardInfo) {
            return (
                <ListGroup.Item key='challengeRewards'>
                    {this.renderChallengeRewards(challengeRewardInfo)}
                </ListGroup.Item>
            );
        } else if (questRewardsInfo && questRewardsInfo.length > 0) {
            return (
                <ListGroup.Item key='questRewards'>
                    <ListGroup>
                        {this.renderQuestRewards(questRewardsInfo)}
                    </ListGroup>
                </ListGroup.Item>
            );
        }
    }

    renderMilestones() {
        // console.log(this.props.weeklyActivities);
        return this.props.weeklyActivities.map(({milestoneInfo, activitiesInfo, activityRewardsInfo, questRewardsInfo, challengeRewardInfo, milestoneRewards}) => {
            //dont show dungeons or raids
            if (milestoneInfo.displayProperties.name === "Weekly Dungeon Challenge"
                || milestoneInfo.displayProperties.name === 'Deep Stone Crypt'
                || milestoneInfo.displayProperties.name === 'Last Wish Raid'
                || milestoneInfo.displayProperties.name === 'Vault of Glass'
                || milestoneInfo.displayProperties.name === 'Garden of Salvation'
            ) {
                return null;
            }
            return (
                <ListGroup.Item key={milestoneInfo.hash}>
                    <ListGroup horizontal className="milestone">
                        {this.renderIcon(milestoneInfo)}
                        <ListGroup.Item>
                            <h5>{this.renderMilestoneName(milestoneInfo, activitiesInfo)}</h5>
                            {milestoneInfo.displayProperties.description}
                            <ListGroup horizontal className="milestone">
                                {this.renderActivityRewards(milestoneInfo, activityRewardsInfo)}
                            </ListGroup>
                        </ListGroup.Item>
                        {this.renderCorrectRewards(milestoneRewards, challengeRewardInfo, questRewardsInfo)}
                    </ListGroup>
                </ListGroup.Item>
            );
        });
    }

    render () {
        return (
            <div>
                <h2>Weekly Challenges</h2>
                {/* <Form.Check
                    type="checkbox"
                    id={'hide-completed-checkbox'}
                    label={'Hide Completed'}
                /> */}
                <ListGroup>{this.renderMilestones()}</ListGroup>
            </div>
        );
    }
}

function mapStateToProps({weeklyActivities}) {
    return { weeklyActivities };
}

export default connect(mapStateToProps, {fetchWeeklyActivities})(WeeklyActivities);