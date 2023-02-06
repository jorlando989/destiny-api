import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchCruciblePlaylist, fetchNightmareHunts } from "../../actions";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class ActivitiesList extends Component {
    componentDidMount() {
        this.props.fetchCruciblePlaylist();
        this.props.fetchNightmareHunts();
    }

    renderActivities(activities) {
        if (activities == '') {
            return (<div></div>);
        }
        return activities.map(activity => {
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
        let activityToRender = '';
        if (this.props.activityType == 'cruciblePlaylist' && this.props.cruciblePlaylist) {
            activityToRender = this.props.cruciblePlaylist;
        } else if (this.props.activityType == 'nightmareHunts' && this.props.nightmareHunts) {
            activityToRender = this.props.nightmareHunts;
        }
        return (
            <div className="display-in-row">
                {this.renderActivities(activityToRender)}
            </div>
        );
    }
}

function mapStateToProps({ cruciblePlaylist, nightmareHunts }) {
    return { cruciblePlaylist, nightmareHunts };
}

export default connect(mapStateToProps, { fetchCruciblePlaylist, fetchNightmareHunts })(ActivitiesList);