import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchWellspringReward } from "../../actions";

class Wellspring extends Component {
    componentDidMount() {
        this.props.fetchWellspringReward();
    }

    renderRewards(rewards) {
        return rewards.map(group => {
            return group.map(item => {
                return (
                    <div className="display-in-row" key={item.hash}>
                        <img src={`https://www.bungie.net${item.displayProperties.icon}`} className="vendorIcon" alt="wellspring reward icon"/>
                        <div>{item.displayProperties.name}</div>
                    </div>
                );
            });
        });
    }
    
    render() {
        if (this.props.wellspringReward.hasOwnProperty("activityInfo")) {
            const reward = this.props.wellspringReward.rewardInfo;
            const activity = this.props.wellspringReward.activityInfo;
            return (
                <div className="bg-teal itemCard rounded-corners whiteText">
                    <div>
                        <h3>{activity.displayProperties.name}</h3>
                        <div>
                            {activity.displayProperties.description}
                        </div>
                    </div>
                    <hr />
                    {this.renderRewards(this.props.wellspringReward.activityRewards)}
                </div>
            );
        }
    }
}

function mapStateToProps({ wellspringReward }) {
    return { wellspringReward };
}

export default connect(mapStateToProps, { fetchWellspringReward })(Wellspring);