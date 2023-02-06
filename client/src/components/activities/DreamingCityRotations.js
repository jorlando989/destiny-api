import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchDreamingCityRotations } from "../../actions";

class DreamingCityRotations extends Component {
    componentDidMount() {
        this.props.fetchDreamingCityRotations();
    }
    
    render() {
        if (this.props.dreamingCityRotations) {
            const curseWeek = this.props.dreamingCityRotations.curseWeek;
            const ascendantChallenge = this.props.dreamingCityRotations.ascendantChallenge;
            return (
                <div className="display-in-row">
                    <div className="bg-teal itemCard min-width rounded-corners whiteText mr5">
                        <h4>{curseWeek.strength} Curse</h4>
                        <div>
                            <i>Petra can be found in {curseWeek.petraLocation}</i>
                        </div>
                    </div>
                    <div className="bg-teal itemCard min-width rounded-corners whiteText">
                        <h4>Ascendant Challenge: {ascendantChallenge.currAscendantChallengeInfo.challengeName}</h4>
                        <div>
                            <i>Found in {ascendantChallenge.currAscendantChallenge}</i>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps({ dreamingCityRotations }) {
    return { dreamingCityRotations };
}

export default connect(mapStateToProps, { fetchDreamingCityRotations })(DreamingCityRotations);