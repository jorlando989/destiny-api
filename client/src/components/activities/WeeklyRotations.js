import React, { Component } from "react";
import Countdown from 'react-countdown';

class WeeklyActivities extends Component {
    renderCountdown() {
        const now = new Date();
        //reset time is tuesday (2) at 1pm EST
        const weekDaysToReset = [2,1,0,6,5,4,3];
        let resetTime = null;
        if (now.getDay() === 2 && now.getHours() >= 13) {
            //reset is today at 1pm
            resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 13);
        } else {
            //reset is x days away at 1pm EST
            resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + weekDaysToReset[now.getDay()], 13);
        }
        return (
            <Countdown date={resetTime} />
        );
    }

    render () {
        return (
            <div>
                <div className='display-in-row'>
                    <h2>Weekly Rotations</h2>
                    <h5 className='align-right'>Time until Reset: {this.renderCountdown()}</h5>
                </div>

                <h4>Nightfall</h4>
                {/* let renderedContent = null;
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
            } */}
                <h4>Weekly Raid</h4>
                <h4>Weekly Dungeon</h4>
                <h4>Crucible Playlist</h4>
                <h4>Nightmare Hunts</h4>
                <h4>Dreaming City - Curse Week and Ascendant Challenge</h4>
                <h4>Raid Challenges</h4>
            </div>
        );
    }
}

export default WeeklyActivities;