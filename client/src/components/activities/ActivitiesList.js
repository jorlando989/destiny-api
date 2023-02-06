import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchCruciblePlaylist, fetchNightmareHunts, fetchEmpireHunt } from "../../actions";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class ActivitiesList extends Component {
    componentDidMount() {
        this.props.fetchCruciblePlaylist();
        this.props.fetchNightmareHunts();
        this.props.fetchEmpireHunt();
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
        } else if (this.props.activityType == 'empireHunt' && this.props.empireHunt) {
            activityToRender = this.props.empireHunt;
        }
        return (
            <div className="display-in-row">
                {this.renderActivities(activityToRender)}
            </div>
        );
    }
}

function mapStateToProps({ cruciblePlaylist, nightmareHunts, empireHunt }) {
    return { cruciblePlaylist, nightmareHunts, empireHunt };
}

export default connect(mapStateToProps, { fetchCruciblePlaylist, fetchNightmareHunts, fetchEmpireHunt })(ActivitiesList);