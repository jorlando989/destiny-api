import React, { Component } from "react";
import Countdown from 'react-countdown';

import ActivitiesList from "./ActivitiesList";
import DreamingCityRotations from "./DreamingCityRotations";
import EmpireHunt from "./EmpireHunt";
import WeeklyNightfall from "./WeeklyNightfall";

class WeeklyActivities extends Component {
    renderCountdown() {
        const now = new Date();
        //reset time is tuesday (2) at 1pm EST
        const weekDaysToReset = [2,1,0,6,5,4,3];
        let resetTime = null;
        const daylight_savings = false;

        if (daylight_savings) {
            //DAYLIGHT SAVINGS
            if (now.getDay() === 2 && now.getHours() >= 13) {
                //reset is today at 1pm
                resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 1);
            } else {
                //reset is x days away at 1pm EST
                resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + weekDaysToReset[now.getDay()], 13);
            }
        } else {
            //REGULAR
            if (now.getDay() === 2 && now.getHours() >= 13) {
                //reset is today at 12pm
                resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 12);
            } else {
                //reset is x days away at 12pm EST
                resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + weekDaysToReset[now.getDay()], 12);
            }
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
                <WeeklyNightfall />
                
                <div className="display-in-row">
                    <div>
                        <h4>Weekly Raid</h4>
                        <h4>Raid Challenges</h4>
                    </div>
                    <div>
                        <h4>Weekly Dungeon</h4>
                    </div>
                </div>
                
                <div>
                    <h4>Crucible Playlist</h4>
                    <ActivitiesList activityType="cruciblePlaylist"/>
                </div>
                <div>
                    <h4>Nightmare Hunts</h4>
                    <ActivitiesList activityType="nightmareHunts"/>
                </div>
                <div>
                    <h4>Empire Hunt</h4>
                    <EmpireHunt />
                </div>
                
                <div>
                    <h4>Dreaming City - Curse Week and Ascendant Challenge</h4>
                    <DreamingCityRotations />
                </div>
            </div>
        );
    }
}

export default WeeklyActivities;