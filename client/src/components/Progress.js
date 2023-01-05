import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchVendorRanks, selectChar, fetchSeasonalChallenges, fetchBounties } from '../actions';
import Accordion from 'react-bootstrap/Accordion';
import ProgressBar from 'react-bootstrap/ProgressBar';

import CharacterSelector from './CharacterSelector';
import VendorRanks from "./vendors/VendorRanks";
import SeasonalChallenges from "./records/SeasonalChallenges";
import SeasonalArtifact from "./records/SeasonalArtifact";

class Progress extends Component {
    componentDidMount() {
        //if character is set in local storage, use that as selectedChar
        this.props.selectChar();
        this.props.fetchVendorRanks();
        this.props.fetchSeasonalChallenges();
        this.props.fetchBounties();
    }

    renderProgress(type, objectivesData) {
        if (type !== 'questItem' && objectivesData) {
            const renderObjDesc = objectivesData.length > 1;
            return objectivesData.map(({obj, objInfo}) => {
                return (
                    <div className="display-in-row mt5" key={objInfo.hash}>
                        <span className='smallLabel'>{renderObjDesc ? objInfo.progressDescription : null}</span>
                        <ProgressBar 
                            now={obj.progress} 
                            max={obj.completionValue} 
                            label={`${obj.progress}/${obj.completionValue}`}
                            className="challengeProgress"
                        />
                    </div>
                );
            });
        }
    }

    renderBounties(bounties, type) {
        if (bounties) {
            return (
                <div className='bountyGrid'>
                    {bounties.map(({bounty, bountyData, objectivesData}) =>{
                        return (
                            <div className="row-item display-in-row">
                                <img className='medium-icon row-item' src={`https://www.bungie.net${bountyData.displayProperties.icon}`}/>
                                <div className="row-item">
                                    <b>{bountyData.displayProperties.name}</b>
                                    <div className="description">
                                        {bountyData.displayProperties.description}
                                    </div>
                                    {this.renderProgress(type, objectivesData)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <h2>Progress</h2>
                <CharacterSelector />
                <br />
                <Accordion defaultActiveKey={['0','5']} alwaysOpen>
                    <Accordion.Item key='0' eventKey='0'>
                        <Accordion.Header><h5>Vendor Rank Progress</h5></Accordion.Header>
                        <Accordion.Body>
                            <VendorRanks />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item key='5' eventKey='5'>
                        <Accordion.Header><h5>Seasonal Rank and Artifact</h5></Accordion.Header>
                        <Accordion.Body>
                            <SeasonalArtifact />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item key='1' eventKey='1'>
                        <Accordion.Header><h5>Seasonal Challenges</h5></Accordion.Header>
                        <Accordion.Body>
                            <SeasonalChallenges />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item key='2' eventKey='2'>
                        <Accordion.Header><h5>Bounties</h5></Accordion.Header>
                        <Accordion.Body>
                            {this.renderBounties(this.props.bounties.bounties, 'bounty')}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item key='3' eventKey='3'>
                        <Accordion.Header><h5>Quests</h5></Accordion.Header>
                        <Accordion.Body>
                            {this.renderBounties(this.props.bounties.quests, 'quest')}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item key='4' eventKey='4'>
                        <Accordion.Header><h5>Quest Items</h5></Accordion.Header>
                        <Accordion.Body>
                            {this.renderBounties(this.props.bounties.questItems, 'questItem')}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        );
    }
}

function mapStateToProps({bounties}) {
    return { bounties };
}

export default connect(mapStateToProps, { 
    selectChar, 
    fetchVendorRanks, 
    fetchSeasonalChallenges,
    fetchBounties
})(Progress);