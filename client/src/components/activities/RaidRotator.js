import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchRaidRotator, fetchDungeonRotator } from "../../actions";

import Card from 'react-bootstrap/Card';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class RaidRotator extends Component {
    componentDidMount() {
        this.props.fetchRaidRotator();
        this.props.fetchDungeonRotator();
    }

    renderRotation(rotation, current, type) {
        if (rotation) {
            let iconImage = null;
            if (type === "Dungeon") {
                iconImage = '/common/destiny2_content/icons/DestinyMilestoneDefinition_7b2e832d6fa3513b3c3e55f69aaeee40.png';
            }
            return rotation.map(rotator => {
                let classes = "display-in-row center-vertical";
                if (rotator.displayProperties.name == current) {
                    classes = classes.concat(" currentWeapon");
                }
                if (iconImage === null) {
                    iconImage = rotator.displayProperties.icon;
                }
                return (
                    <div key={rotator.hash}>
                        <div className={classes}>
                            <img src={`https://www.bungie.net${iconImage}`} className='weaponIcon darkBgIcon' alt='weapon icon'/>
                            {rotator.originalDisplayProperties.name}
                        </div>
                    </div>
                );
            })
        }
    }
    
    renderMaster(masterInfo, masterModifiers) {
        if (masterInfo) {
            return (
                <Card style={{ width: '25rem' }}>
                    <Card.Img variant="top" src={`https://www.bungie.net${masterInfo.pgcrImage}`} />
                    <Card.Body>
                        <Card.Title>{masterInfo.displayProperties.name}</Card.Title>
                        {this.renderModifiers(masterModifiers)}
                    </Card.Body>
                </Card>
            );
        }
    }

    renderModifiers(modifiers) {
        if (modifiers) {
            return ( 
                <div>
                    <span className="subTitle"><u>Modifiers:</u></span>
                    <div className='display-in-row-wrap'>
                        {modifiers.map(modifier => {
                            return (
                                <div key={modifier.hash}>
                                    <OverlayTrigger
                                        key={modifier.hash}
                                        placement='top'
                                        overlay={
                                            <Tooltip id='modifier description'>
                                                <b>{modifier.displayProperties.name}</b>
                                                <hr />
                                                {modifier.displayProperties.description}
                                            </Tooltip>
                                        }
                                    >
                                        <img
                                            src={`https://www.bungie.net${modifier.displayProperties.icon}`}
                                            className='modifierIcon'
                                            alt='strike modifier icon'
                                        />
                                    </OverlayTrigger>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
    }

    renderChallenges(challenges) {
        if (challenges) {
            return ( 
                <div>
                    <span className="subTitle"><u>Challenges:</u></span>
                    <div className='display-in-row-wrap'>
                        {challenges.map(challenge => {
                            return (
                                <div key={challenge.hash}>
                                    <OverlayTrigger
                                        key={challenge.hash}
                                        placement='top'
                                        overlay={
                                            <Tooltip id='challenge description'>
                                                <b>{challenge.displayProperties.name}</b>
                                                <hr />
                                                {challenge.displayProperties.description}
                                            </Tooltip>
                                        }
                                    >
                                        <img
                                            src={`https://www.bungie.net${challenge.displayProperties.icon}`}
                                            className='modifierIcon'
                                            alt='challenge icon'
                                        />
                                    </OverlayTrigger>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
    }

    renderRotator(rotator, type) {
        return (
            <div className="display-in-row">
                <div className="ml5 mr5 nightfallRow2 ">
                    <div className="ml5">
                        <h3>Weekly Featured {type}</h3>
                    </div>
                    <div className="display-in-row">
                        <div key={rotator.rotatorInfo.hash}>
                            <Card style={{ width: '25rem' }}>
                                <Card.Img variant="top" src={`https://www.bungie.net${rotator.rotatorInfo.pgcrImage}`} />
                                <Card.Body>
                                    <Card.Title>{rotator.rotatorInfo.displayProperties.name}</Card.Title>
                                    {this.renderChallenges(rotator.challenges)}
                                </Card.Body>
                            </Card>
                        </div>
                        <div>
                            {this.renderMaster(rotator.masterInfo, rotator.masterModifiers)}
                        </div>
                    </div>
                </div>
                <div className="nightfallRow1">
                    <h4>Featured {type} Rotation</h4>
                    <hr />
                    <div>
                        {this.renderRotation(rotator.rotation, rotator.rotatorInfo.displayProperties.name, type)}
                    </div>
                </div>
            </div>
        );
    }
    
    render() {
        if (this.props.raidRotator && this.props.dungeonRotator) {
            return (
                <div>
                    {this.renderRotator(this.props.raidRotator, "Raid")}
                    {this.renderRotator(this.props.dungeonRotator, "Dungeon")}
                </div>
            );
        }
    }
}

function mapStateToProps({ raidRotator, dungeonRotator }) {
    return { raidRotator, dungeonRotator };
}

export default connect(mapStateToProps, { fetchRaidRotator, fetchDungeonRotator })(RaidRotator);