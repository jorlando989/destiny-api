import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchAltarsOfSorrowReward } from "../../actions";

class AltarsOfSorrow extends Component {
    componentDidMount() {
        this.props.fetchAltarsOfSorrowReward();
    }
    
    render() {
        if (this.props.altarsOfSorrowReward.hasOwnProperty("rewardInfo")) {
            const reward = this.props.altarsOfSorrowReward.rewardInfo;
            return (
                <div className="bg-teal itemCard min-width rounded-corners whiteText">
                    <div className="display-in-row center-vertical">
                        <img src={`https://www.bungie.net${reward.displayProperties.icon}`} className="iconImage" alt="altars of sorrow reward"/>
                        {reward.displayProperties.name}
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps({ altarsOfSorrowReward }) {
    return { altarsOfSorrowReward };
}

export default connect(mapStateToProps, { fetchAltarsOfSorrowReward })(AltarsOfSorrow);