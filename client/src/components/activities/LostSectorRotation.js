import React, { Component } from "react";
import { connect } from 'react-redux';
import {fetchDailyLostSector} from '../../actions';

import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class LostSectorRotation extends Component {
    componentDidMount() {
        this.props.fetchDailyLostSector();
    }

    renderDamageIcons(description) {
        const splitDesc = description.split(' ');
        const damageTypes = this.props.dailyLostSector.DamageTypes;
        const renderedDesc = splitDesc.map(part => {
            switch (part) {
                case '[Solar]': 
                    return (<img key='solarIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Solar'].transparentIcon}`} alt='solar element icon'/>);
                case '[Void]':
                    return (<img key='voidIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Void'].transparentIcon}`} alt='void element icon'/>);
                case '[Arc]':
                    return (<img key='arcIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Arc'].transparentIcon}`} alt='arc element icon'/>);
                default:
                    return ' ' + part + ' ';
            }
        });
        return renderedDesc;
    }

    renderBreakerIcons(description) {
        const splitDesc = description.split(' ');
        const breakerTypes = this.props.dailyLostSector.BreakerTypes;
        const renderedDesc = splitDesc.map(part => {
            switch (part) {
                case '[Shield-Piercing]': 
                    return (<img key='shieldPiercingIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Shield-Piercing'].icon}`} alt='anti-barrier icon'/>);
                case '[Disruption]':
                    return (<img key='disruptionIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Disruption'].icon}`} alt='overload icon'/>);
                case '[Stagger]':
                    return (<img key='staggerIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Stagger'].icon}`} alt='unstoppable icon'/>);
                default:
                    return ' ' + part + ' ';
            }
        });
        return renderedDesc;
    }

    renderModifiers(modifiers) {
        return modifiers.map(mod => {
            let renderedDescription = mod.displayProperties.description;
            if(mod.displayProperties.name === "Champion Foes") {
                renderedDescription = this.renderBreakerIcons(renderedDescription);
            }
            if (mod.displayProperties.name === "Shielded Foes") {
                renderedDescription = this.renderDamageIcons(renderedDescription);
            }
            return (
                <div key={mod.hash} className='icon-m5'>
                    <OverlayTrigger
                        key={mod.hash}
                        placement="right"
                        overlay={
                            <Tooltip id='modifier description'>
                                <b>{mod.displayProperties.name}</b>
                                <hr />
                                {renderedDescription}
                            </Tooltip>
                        }
                    >
                        <img src={`https://www.bungie.net${mod.displayProperties.icon}`} className='vendorIcon' alt='mod icon'/>
                    </OverlayTrigger>
                </div>
            );
        });
    }

    renderRewards(rewards, currReward) {
        return rewards.map(reward => {
            if (reward.displayProperties.name.includes("Exotic") && !reward.displayProperties.name.includes(currReward)) {
                return '';
            }
            return (
                <div key={reward.hash}>
                    <img src={`https://www.bungie.net${reward.displayProperties.icon}`} className='vendorIcon' alt='reward icon'/>
                    {reward.displayProperties.name}
                </div>
            );
        });
    }
    
    render() {
        if (this.props.dailyLostSector) {
            const lostSector = this.props.dailyLostSector;
            return (
                <div className='display-in-row'>
                    <Card style={{ width: '25rem' }}>
                        <Card.Img variant="top" src={`https://www.bungie.net${lostSector.legendInfo.pgcrImage}`} />
                        <Card.Body>
                            <Card.Title>{lostSector.currLostSector} - Legend</Card.Title>
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
                        <Card.Img variant="top" src={`https://www.bungie.net${lostSector.masterInfo.pgcrImage}`} />
                        <Card.Body>
                            <Card.Title>{lostSector.currLostSector} - Master</Card.Title>
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
}

function mapStateToProps({ dailyLostSector }) {
    return { dailyLostSector };
}

export default connect(mapStateToProps, { fetchDailyLostSector })(LostSectorRotation);