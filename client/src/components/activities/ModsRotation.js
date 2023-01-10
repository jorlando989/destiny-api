import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchVendorModsAda, fetchVendorModsBanshee } from "../../actions";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Spinner from 'react-bootstrap/Spinner';

class ModsRotation extends Component {
    componentDidMount() {
        console.log('test');
        // if (this.props.vendor === 'Ada-1') {
        //     this.props.fetchVendorModsAda(this.props.vendor);
        // } else if (this.props.vendor === 'Banshee') {
        //     this.props.fetchVendorModsBanshee(this.props.vendor);
        // }
    }

    renderMods(currVendorMods) {
        if (this.props.currChar && currVendorMods) {
            return currVendorMods.map(mod => {
                return (
                    <div key={mod.hash}>
                        <OverlayTrigger
                            key={mod.hash}
                            placement="top"
                            overlay={
                                <Tooltip id='modifier description'>
                                    <b>{mod.displayProperties.name}</b>
                                </Tooltip>
                            }
                        >
                            <img src={`https://www.bungie.net${mod.displayProperties.icon}`} alt={`${mod.displayProperties.name} mod icon`} />
                        </OverlayTrigger>
                    </div>
                );
            });
        } else {
            return (
                <div className='loadingSpinner'>
                    <Spinner animation="border"/>
                </div>
            );
        }
    }

    render() {
        let currVendorMods = null;
        if (this.props.currChar) {
            if (this.props.vendor === 'Ada-1') {
                currVendorMods = this.props.vendorModsAda;
            } else if (this.props.vendor === 'Banshee') {
                currVendorMods = this.props.vendorModsBanshee;
            }
            return (
                <div className='display-in-row mods bg-teal'>
                    {this.renderMods(currVendorMods)}
                </div>
            );
        } else {
            return (
                <div className='loadingSpinner'>
                    <Spinner animation="border"/>
                </div>
            );
        }
    }
}

function mapStateToProps({ vendorModsAda, vendorModsBanshee, currChar }) {
    return { vendorModsAda, vendorModsBanshee, currChar };
}

export default connect(mapStateToProps, {fetchVendorModsAda, fetchVendorModsBanshee})(ModsRotation);