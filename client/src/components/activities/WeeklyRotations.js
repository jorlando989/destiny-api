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