import React, { Component } from "react";
import Accordion from 'react-bootstrap/Accordion';
import CharacterSelector from './CharacterSelector';
import { connect } from 'react-redux';
import { fetchVendorRanks, selectChar } from '../actions';
import VendorRanks from "./vendors/VendorRanks";

class Progress extends Component {
    componentDidMount() {
        //if character is set in local storage, use that as selectedChar
        this.props.selectChar();
        this.props.fetchVendorRanks();
    }

    render() {
        return (
            <div>
                <h2>Progress</h2>
                <CharacterSelector />
                <br />

                <Accordion defaultActiveKey={['0','1','2','3','4']} alwaysOpen>
                    <Accordion.Item key='0' eventKey='0'>
                        <Accordion.Header><h5>Vendor Rank Progress</h5></Accordion.Header>
                        <Accordion.Body>
                            <VendorRanks />
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item key='1' eventKey='1'>
                        <Accordion.Header><h5>Seasonal Challenges</h5></Accordion.Header>
                        <Accordion.Body>
                            
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

export default connect(null, { selectChar, fetchVendorRanks })(Progress);