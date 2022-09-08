import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchVendorRanks, selectChar, fetchSeasonalChallenges } from '../actions';
import Accordion from 'react-bootstrap/Accordion';
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
    }

    render() {
        return (
            <div>
                <h2>Progress</h2>
                <CharacterSelector />
                <br />
                <Accordion defaultActiveKey={['0','1','2','3','4','5']} alwaysOpen>
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
                            
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item key='3' eventKey='3'>
                        <Accordion.Header><h5>Quests</h5></Accordion.Header>
                        <Accordion.Body>
                            
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item key='4' eventKey='4'>
                        <Accordion.Header><h5>Quest Items</h5></Accordion.Header>
                        <Accordion.Body>
                            
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        );
    }
}

export default connect(null, { 
    selectChar, 
    fetchVendorRanks, 
    fetchSeasonalChallenges 
})(Progress);