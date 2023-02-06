import React, { Component } from "react";
import { connect } from 'react-redux';
import { selectChar, fetchVendorModsAda, fetchVendorModsBanshee } from '../../actions';
import Countdown from 'react-countdown';

import LostSectorRotation from "./LostSectorRotation";
import ModsRotation from "./ModsRotation";
import CharacterSelector from '../CharacterSelector';
import AltarsOfSorrow from "./AltarsOfSorrow";
import Wellspring from "./Wellspring";
import StrikeModifiers from "./StrikeModifiers";

class DailyActivities extends Component {
    componentDidMount() {
        this.props.selectChar();
        this.props.fetchVendorModsAda('Ada-1');
        this.props.fetchVendorModsBanshee('Banshee');
    }
    
    renderCountdown() {
        const now = new Date();
        //reset time is either next day at 1pm or same day at 1 pm
        let resetTime = null;
        const daylight_savings = false;

        if (daylight_savings) {
            //DAYLIGHT SAVINGS
            if (now.getHours() >= 13) {
                //reset is tomorrow at 1pm
                resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13);
            } else {
                //reset is today at 1pm
                resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13);
            }
        } else {
            //REGULAR
            if (now.getHours() >= 12) {
                //reset is tomorrow at 12pm
                resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12);
            } else {
                //reset is today at 12pm
                resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
            }
        }
        
        return (
            <Countdown date={resetTime} />
        );
    }

    render() {
        return (
            <div>
                <div className='display-in-row'>
                    <h2>Daily Rotations</h2>
                    <h5 className='align-right'>Time until Reset: {this.renderCountdown()}</h5>
                </div>

                <CharacterSelector />

                <h4>Lost Sector</h4>
                <LostSectorRotation />
                
                <div className='display-in-row rowSpacing'>
                    <div>
                        <h4>Ada-1 Mods</h4>
                        <ModsRotation vendor={'Ada-1'}/>
                    </div>
                    
                    <div>
                        <h4>Banshee Mods</h4>
                        <ModsRotation vendor={'Banshee'}/>
                    </div>
                </div>

                <div>
                    <h4>Altars of Sorrow Reward</h4>
                    <AltarsOfSorrow />
                </div>
                <div>
                    <h4>Wellspring</h4>
                    <Wellspring />
                </div>
                
                <div>
                    <h4>Strike Modifiers</h4>
                    <StrikeModifiers />
                </div>
                
            </div>
        );
    }
}

export default connect(null, {selectChar, fetchVendorModsAda, fetchVendorModsBanshee})(DailyActivities);