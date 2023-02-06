import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchEmpireHunt } from "../../actions";

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Card from 'react-bootstrap/Card';

class EmpireHunt extends Component {
    componentDidMount() {
        this.props.fetchEmpireHunt();
    }

    renderActivity(activity) {
        return (
            <div key={activity.hash}>
                <Card style={{ width: '25rem' }}>
                    <Card.Img variant="top" src={`https://www.bungie.net${activity.pgcrImage}`} />
                    <Card.Body>
                        <Card.Title>{activity.displayProperties.name}</Card.Title>
                    </Card.Body>
                </Card>
            </div>
        );
    }
    
    render() {
        if (this.props.empireHunt) {
            return (
                <div className="display-in-row">
                    {this.renderActivity(this.props.empireHunt)}
                </div>
            );
        }
    }
}

function mapStateToProps({ empireHunt }) {
    return { empireHunt };
}

export default connect(mapStateToProps, { fetchEmpireHunt })(EmpireHunt);