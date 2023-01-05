import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchWeeklyActivities, setCompletedWeeklyActivityVisibility } from '../../actions';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class WeeklyActivities extends Component {
    componentDidMount () {
        this.props.fetchWeeklyActivities();
        this.props.setCompletedWeeklyActivityVisibility();
        this.props.setCompletedWeeklyActivityVisibility('none');
        this.handleChange = this.handleChange.bind(this);
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
            return (
                <ListGroup.Item>
                    <img src={`https://www.bungie.net${milestoneInfo.displayProperties.icon}`} className="challengeIcon" alt="milestoneIcon" />
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
                        <div key={item.itemInfo.hash}>
                            <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                            {item.itemInfo.displayProperties.name}
                        </div>
                    );
                });
            });
        }
    }

    renderActivityRewards(milestoneInfo, activityRewardsInfo) {
        if (activityRewardsInfo && activityRewardsInfo.length > 0) {
            let renderedContent = null;
            if (milestoneInfo.friendlyName === "MILESTONE_WEEKLY_NIGHTFALL" 
                || milestoneInfo.friendlyName === "MILESTONE_WEEKLY_NIGHTFALL_SCORE"
            ) {
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

    renderChallengeRewards(milestoneInfo, challengeRewardInfo) {
        if (challengeRewardInfo && challengeRewardInfo.length > 0) {
            let allRenderedContent = null;
            //check if raid is weekly featured raid
            if (milestoneInfo.displayProperties.name === 'Last Wish Raid'
                || milestoneInfo.displayProperties.name === 'Deep Stone Crypt'
                || milestoneInfo.displayProperties.name === 'Garden of Salvation'
                || milestoneInfo.displayProperties.name === 'Vault of Glass'
                || milestoneInfo.displayProperties.name === 'Vow of the Disciple') 
            {
                if (this.props.weeklyActivities.charProgressAndClass[0].progression[milestoneInfo.hash].activities[0].challenges.length === 0) {
                    //not pinnacle
                    return (
                        <div key={milestoneInfo.hash}>
                            <img src='https://www.bungie.net/common/destiny2_content/icons/ca25b277ec22eddd9f4e9881dd153390.png' className="vendorIcon" alt="rewardItemIcon" />
                            Legendary Gear
                        </div>
                    );
                }
            }
            allRenderedContent = challengeRewardInfo.map(({challengesInfo}) => {
                return challengesInfo.map(challenge => {
                    return challenge.dummyRewardsInfo.map(({dummyInfo}) => {
                        const imgSrc = dummyInfo.displayProperties.hasIcon ? `https://www.bungie.net${dummyInfo.displayProperties.icon}` : null;
                        return (
                            <div key={dummyInfo.hash}>
                                <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                                {dummyInfo.displayProperties.name}
                            </div>
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
                            <ListGroup.Item key={entry.rewardEntryHash}>
                                {entry.displayProperties.name}: <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                                {entryInfo[0].displayProperties.name}
                            </ListGroup.Item>
                        );
                    });
                } else if (reward.categoryIdentifier !== 'milestone_clan_past_week') {
                    return rewardEntriesInfo.map(({entry, entryInfo}) => {
                        const imgSrc = entryInfo[0].displayProperties.hasIcon ? `https://www.bungie.net${entryInfo[0].displayProperties.icon}` : null;
                        return (
                            <div key={entry.rewardEntryHash}>
                                <img src={imgSrc} className="vendorIcon" alt="rewardItemIcon" />
                                {entryInfo[0].displayProperties.name}
                            </div>
                        );
                    });
                }
                return null;
            });
        }
    }

    renderCorrectRewards(milestoneInfo, milestoneRewards, challengeRewardInfo, questRewardsInfo) {
        if (milestoneRewards) {
            return (
                <div key='milestoneRewards'>
                    {this.renderMilestoneRewards(milestoneRewards)}
                </div>
            );
        } else if (challengeRewardInfo) {
            return (
                <div key='challengeRewards'>
                    {this.renderChallengeRewards(milestoneInfo, challengeRewardInfo)}
                </div>
            );
        } else if (questRewardsInfo && questRewardsInfo.length > 0) {
            return (
                <div key='questRewards'>
                    {this.renderQuestRewards(questRewardsInfo)}
                </div>
            );
        } else {
            return (
                <div className='display-in-row'>
                    <img className="vendorIcon" src='https://www.bungie.net/common/destiny2_content/icons/962055a3f8c73eff98f140f6fac79392.png' alt='reward engram icon'/>
                    Powerful Gear (Tier 1)
                </div>
            );
        }
    }

    renderHeader() {
        if (this.props.weeklyActivities.hasOwnProperty('charProgressAndClass')) {
            return (
                <Row className='milestoneHeader'>
                    <Col xs={6}>Activity</Col>
                    {this.props.weeklyActivities.charProgressAndClass.map(char => {
                        return (<Col key={char.class}>{char.class}</Col>);
                    })}
                </Row>
            );
        }
    }

    renderRadioButtons() {
        if (this.props.weeklyActivities.hasOwnProperty('charProgressAndClass')) {
            return (
                <div className="display-in-row">
                    {this.props.weeklyActivities.charProgressAndClass.map(char => {
                        return (
                            <div className="radioButton" key={char.class}>
                                <input 
                                    type="radio" 
                                    name='hideChallenges' 
                                    value={char.class} 
                                    onChange={this.handleChange}
                                    checked={this.props.weeklyActivityVisibility === char.class}
                                /> {char.class}
                            </div>
                        );
                    })}
                    <div className="radioButton">
                        <input 
                            type="radio" 
                            name='hideChallenges' 
                            value='all'
                            onChange={this.handleChange}
                            checked={this.props.weeklyActivityVisibility === 'all'}
                        /> All
                    </div>
                    <div className="radioButton">
                        <input 
                            type="radio" 
                            name='hideChallenges' 
                            value='none'
                            onChange={this.handleChange}
                            checked={this.props.weeklyActivityVisibility === 'none'} 
                        /> None
                    </div>
                </div>
            );
        }
    }

    renderCompletionStatus(milestoneHash, milestoneInfo) {
        if (milestoneInfo.displayProperties.name === 'Weekly Clan Engrams') {
            return (
                <Col>
                    <div className='display-in-row'>
                        {this.props.weeklyActivities.charProgressAndClass[0].progression[milestoneHash].rewards[0].entries.map(reward => {
                            if (reward.earned) {
                                return (
                                    <div className='display-in-row mr5'>
                                        {this.props.weeklyActivities.WeeklyClanEngramRewards[reward.rewardEntryHash]}
                                        <div className='streakBox ml5'>
                                            <div className='streakBoxComplete'></div>
                                        </div>
                                    </div>
                                );
                            }
                            return (<div className='streakBox'></div>);
                        })}
                    </div>
                </Col>
            );
        }
        return this.props.weeklyActivities.charProgressAndClass.map(char => {
            if (char.progression[milestoneHash]) {
                //check for activities
                if (char.progression[milestoneHash].activities) {
                    const charActivities = char.progression[milestoneHash].activities;
                    if (charActivities[0].phases) {
                        return (
                            <Col className='display-in-row'>
                            {charActivities[0].phases.map(phase => {
                                if (phase.complete) {
                                    return (
                                        <div className='streakBox'>
                                            <div className='streakBoxComplete'></div>
                                        </div>
                                    );
                                }
                                return (<div className='streakBox'></div>);
                            })}
                            </Col>
                        );
                    } else if (charActivities[0].challenges) {
                        if (charActivities[0].challenges[0].objective.complete) {
                            return (<Col>
                                <div className='streakBox'>
                                    <div className='streakBoxComplete'></div>
                                </div>
                            </Col>);
                        } else {
                            return (<Col>
                                <div className='streakBox'></div>
                                <span className="smallLabel">
                                    {charActivities[0].challenges[0].objective.progress}/{charActivities[0].challenges[0].objective.completionValue}
                                </span>
                            </Col>);
                        }
                    }

                } else if (char.progression[milestoneHash].availableQuests) {
                    const availQuests = char.progression[milestoneHash].availableQuests[0];
                    if (availQuests.status.completed) {
                        return (<Col>
                            <div className='streakBox'>
                                <div className='streakBoxComplete'></div>
                            </div>
                        </Col>);
                    } 
                    return (<Col>
                        <div className='streakBox'></div>
                        <span className='smallLabel'>
                            {availQuests.status.stepObjectives[0].progress}/{availQuests.status.stepObjectives[0].completionValue}
                        </span>
                    </Col>);
                }
            }
            return (<Col>
                <div className='streakBox'>
                    <div className='streakBoxComplete'></div>
                </div>
            </Col> );
        })
    }

    checkIfDungeonIsPinnacle(milestoneHash) {
        //grasp currently broken
        const characters = this.props.weeklyActivities.charProgressAndClass;
        for(let i=0; i<characters.length; i++) {
            if (characters[i].progression[milestoneHash]) {
                return true;
            }
        }
        return false;
    }

    isComplete(activityInfo) {
        if (!activityInfo) return true;
        //check for activities
        if (activityInfo.activities) {
            const charActivities = activityInfo.activities;
            if (charActivities[0].phases) {
                let allPhasesComplete = true;
                charActivities[0].phases.map(phase => {
                    if (!phase.complete) {
                        allPhasesComplete = false;
                    }
                });
                return allPhasesComplete;
            } else if (charActivities[0].challenges) {
                return charActivities[0].challenges[0].objective.complete;
            }
        } else if (activityInfo.availableQuests) {
            const availQuests = activityInfo.availableQuests[0];
            if (availQuests.status.completed) {
                return true;
            } 
            return false;
        }
        return true;
    }

    checkCompletionStatus(milestoneInfo, visibilityType) {
        const characters = this.props.weeklyActivities.charProgressAndClass;
        if (visibilityType === 'all') {
            let allCharacterCompleted = true;
            for(let i=0; i<characters.length; i++) {
                if (!this.isComplete(characters[i].progression[milestoneInfo.hash])) {
                    allCharacterCompleted = false;
                }
            }
            return allCharacterCompleted;
        } else {
            const currChar = characters.find(elem => elem.class === visibilityType);
            if (currChar && !this.isComplete(currChar.progression[milestoneInfo.hash])) {
                return false;
            }
            return true;
        }
        
    }

    renderMilestones() {
        if (this.props.weeklyActivities.hasOwnProperty('activities')) {
            return this.props.weeklyActivities.activities.map(({milestoneInfo, activitiesInfo, questRewardsInfo, challengeRewardInfo, milestoneRewards}) => {
                //skip certain milestones
                if (milestoneInfo.displayProperties.name === 'Xûr' 
                    || milestoneInfo.displayProperties.name === 'Dawning Duty'
                    || milestoneInfo.displayProperties.name === 'Clan Rewards'
                    || milestoneInfo.displayProperties.name === 'For the Light… Against the Light'
                    || milestoneInfo.displayProperties.name === 'Trials of Osiris (Weekly)'
                    || milestoneInfo.displayProperties.name === 'Master Class') {
                    return null;
                }
                if (milestoneInfo.displayProperties.description === 'Rotating Weekly Dungeon Challenge.' 
                    && !this.checkIfDungeonIsPinnacle(milestoneInfo.hash)) {
                    return null;
                }
                if (this.props.weeklyActivityVisibility !== 'none' && this.checkCompletionStatus(milestoneInfo, this.props.weeklyActivityVisibility)) {
                    //hide completed for all characters
                    return null;
                }
                return (
                    <Row key={milestoneInfo.hash} className='milestoneBody'>
                        <Col xs={6}>
                            <div className='display-in-row milestone'>
                                {this.renderIcon(milestoneInfo)}
                                <ListGroup.Item>
                                    <OverlayTrigger
                                        key={milestoneInfo.hash}
                                        placement="top"
                                        overlay={
                                            <Tooltip id='milestone description'>
                                                {milestoneInfo.displayProperties.description}
                                            </Tooltip>
                                        }
                                    >
                                        <h5>{this.renderMilestoneName(milestoneInfo, activitiesInfo)}</h5>
                                    </OverlayTrigger>
                                    {this.renderCorrectRewards(milestoneInfo, milestoneRewards, challengeRewardInfo, questRewardsInfo)}
                                </ListGroup.Item>
                            </div>
                        </Col>
                        {this.renderCompletionStatus(milestoneInfo.hash, milestoneInfo)}
                    </Row>
                );
            });
        }
    }

    handleChange = (e) => {
        if (e.target) {
            this.props.setCompletedWeeklyActivityVisibility(e.target.value);
        }
    }

    render () {
        return (
            <div>
                <div className="display-in-row">
                    <h2>Weekly Challenges</h2>
                    <div className="checkboxAndLabel display-in-row">
                        <span className='mr5'>Hide Completed
                        <span className="fieldLabel">
                            <i className="fa-regular fa-eye-slash"></i>
                        </span> :</span>
                        {this.renderRadioButtons()}
                    </div>
                </div>
                <Container className='milestoneTable'>
                    {this.renderHeader()}
                    {this.renderMilestones()}
                </Container>
            </div>
        );
    }
}

function mapStateToProps({weeklyActivities, weeklyActivityVisibility}) {
    return { weeklyActivities, weeklyActivityVisibility };
}

export default connect(mapStateToProps, {fetchWeeklyActivities, setCompletedWeeklyActivityVisibility})(WeeklyActivities);