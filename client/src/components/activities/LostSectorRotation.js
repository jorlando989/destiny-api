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
                    return (<img key='solarIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Solar'].transparentIcon}`}/>);
                case '[Void]':
                    return (<img key='voidIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Void'].transparentIcon}`}/>);
                case '[Arc]':
                    return (<img key='arcIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Arc'].transparentIcon}`}/>);
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
                    return (<img key='shieldPiercingIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Shield-Piercing'].icon}`}/>);
                case '[Disruption]':
                    return (<img key='disruptionIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Disruption'].icon}`}/>);
                case '[Stagger]':
                    return (<img key='staggerIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Stagger'].icon}`}/>);
                default:
                    return ' ' + part + ' ';
            }
        });
        return renderedDesc;
    }

    renderModifiers(modifiers) {
        return modifiers.map(mod => {
            const imgSrc = `https://www.bungie.net${mod.displayProperties.icon}`;
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
                        <img src={imgSrc} className='vendorIcon'/>
                    </OverlayTrigger>
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
    
    render() {
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
}

function mapStateToProps({ dailyLostSector }) {
    return { dailyLostSector };
}

export default connect(mapStateToProps, { fetchDailyLostSector })(LostSectorRotation);