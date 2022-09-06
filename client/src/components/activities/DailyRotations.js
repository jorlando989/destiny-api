import React, { Component } from "react";
import { connect } from 'react-redux';
import {fetchDailyLostSector} from '../../actions';
import Card from 'react-bootstrap/Card';
import Countdown from 'react-countdown';

class DailyActivities extends Component {
    componentDidMount() {
        this.props.fetchDailyLostSector();
    }

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

    renderModifiers(modifiers) {
        return modifiers.map(mod => {
            const imgSrc = `https://www.bungie.net${mod.displayProperties.icon}`;
            return (
                <div key={mod.hash} className='icon-m5'>
                    <img src={imgSrc} className='vendorIcon'/>
                </div>
            );
        });
    }

    renderRewards(rewards, currReward) {
        return rewards.map(reward => {
            if (reward.displayProperties.name.includes("Exotic") && !reward.displayProperties.name.includes(currReward.type)) {
                return;
            }
            const imgSrc = `https://www.bungie.net${reward.displayProperties.icon}`;
            return (
                <div key={reward.hash}>
                    <img src={imgSrc} className='vendorIcon' />
                    {reward.displayProperties.name}
                </div>
            );
        });
    }
    
    renderLostSector() {
        if (this.props.dailyLostSector) {
            const lostSector = this.props.dailyLostSector;
            const legendSrc = `https://www.bungie.net${lostSector.legendInfo.pgcrImage}`;
            const masterSrc = `https://www.bungie.net${lostSector.masterInfo.pgcrImage}`;
            return (
                <div className='display-in-row'>
                    <Card style={{ width: '25rem' }}>
                        <Card.Img variant="top" src={legendSrc} />
                        <Card.Body>
                            <Card.Title>{lostSector.currLostSector.name} - Legend</Card.Title>
                            <div className='display-in-row-wrap'>
                                {this.renderModifiers(lostSector.legendModifiers)}
                            </div>
                            <hr />
                            <div>
                                <b>Rewards:</b>
                                {this.renderRewards(lostSector.legendRewards, lostSector.currReward)}
                            </div>
                        </Card.Body>
                    </Card>
                    <Card style={{ width: '25rem' }}>
                        <Card.Img variant="top" src={masterSrc} />
                        <Card.Body>
                            <Card.Title>{lostSector.currLostSector.name} - Master</Card.Title>
                            <div className='display-in-row-wrap'>
                                {this.renderModifiers(lostSector.masterModifiers)}
                            </div>
                            <hr />
                            <div>
                                <b>Rewards:</b>
                                {this.renderRewards(lostSector.masterRewards, lostSector.currReward)}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            );
        }
    }

    render () {
        return (
            <div>
                <div className='display-in-row'>
                    <h2>Daily Activities</h2>
                    <h5 className='align-right'>Time until Reset: {this.renderCountdown()}</h5>
                </div>

                <h4>Lost Sector</h4>
                {this.renderLostSector()}
                
                <h4>Ada-1 Mods</h4>
                <h4>Banshee Mods</h4>
                <h4>Altar of Sorrows Reward</h4>
                <h4>Wellspring</h4>
                <h4>Strike Modifiers</h4>
            </div>
        );
    }
}

function mapStateToProps({ dailyLostSector }) {
    return { dailyLostSector };
}

export default connect(mapStateToProps, { fetchDailyLostSector })(DailyActivities);