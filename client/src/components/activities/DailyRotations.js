import React, { Component } from "react";
import Countdown from 'react-countdown';
import LostSectorRotation from "./LostSectorRotation";
import ModsRotation from "./ModsRotation";

class DailyActivities extends Component {
    renderCountdown() {
        const now = new Date();
        //reset time is either next day at 1pm or same day at 1 pm
        let resetTime = null;
        if (now.getHours() >= 13) {
            //reset is tomorrow at 1pm
            resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13);
        } else {
            //reset is today at 1pm
            resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13);
        }
        return (
            <Countdown date={resetTime} />
        );
    }

    render () {
        return (
            <div>
                <div className='display-in-row'>
                    <h2>Daily Rotations</h2>
                    <h5 className='align-right'>Time until Reset: {this.renderCountdown()}</h5>
                </div>

                <h4>Lost Sector</h4>
                <LostSectorRotation />
                
                <h4>Ada-1 Mods</h4>
                <ModsRotation vendor={'Ada-1'}/>

                <h4>Banshee Mods</h4>
                <ModsRotation vendor={'Banshee'}/>

                <h4>Altar of Sorrows Reward</h4>
                <h4>Wellspring</h4>
                <h4>Strike Modifiers</h4>
            </div>
        );
    }
}

export default DailyActivities;