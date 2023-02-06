import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchCruciblePlaylist } from "../../actions";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class CruciblePlaylist extends Component {
    componentDidMount() {
        this.props.fetchCruciblePlaylist();
    }

    renderActivities(activities) {
        return activities.map(activity => {
            console.log(activity);
            return (
                <div key={activity.hash} className="bg-teal itemCard min-width rounded-corners whiteText mr5">
                    <OverlayTrigger
                        key={activity.hash}
                        placement="top"
                        overlay={
                            <Tooltip id='activity description'>
                                <b>{activity.displayProperties.description}</b>
                            </Tooltip>
                        }
                    >
                        <div>
                            {activity.displayProperties.name}
                        </div>
                    </OverlayTrigger>
                </div>
            );
        });
    }
    
    render() {
        if (this.props.cruciblePlaylist) {
            return (
                <div className="display-in-row">
                    {this.renderActivities(this.props.cruciblePlaylist)}
                </div>
            );
        }
    }
}

function mapStateToProps({ cruciblePlaylist }) {
    return { cruciblePlaylist };
}

export default connect(mapStateToProps, { fetchCruciblePlaylist })(CruciblePlaylist);