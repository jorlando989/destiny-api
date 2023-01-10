import React, { Component } from "react";
import { connect } from 'react-redux';
import { setCompletedChallengedVisibility } from '../../actions';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import ProgressBar from 'react-bootstrap/ProgressBar';

class SeasonalChallenges extends Component {
    componentDidMount() {
        this.props.setCompletedChallengedVisibility();
    }

    renderCompletion(objectiveProgress) {
        if (objectiveProgress.progress >= objectiveProgress.completionValue) {
            return (<div className='streakBoxComplete'></div>);
        }
    }

    renderObjectives(allObjectiveData) {
        if (allObjectiveData) {
            return allObjectiveData.map(({objectiveInfo, objectiveProgress}) => {
                return (
                    <div className="vendorRankInfo" key={objectiveInfo.hash}>
                        <div className='streakBox challengeBox'>
                            {this.renderCompletion(objectiveProgress)}
                        </div>
                        <div>{objectiveInfo.progressDescription}</div>
                        <ProgressBar 
                            now={objectiveProgress.progress} 
                            max={objectiveProgress.completionValue} 
                            label={`${objectiveProgress.progress}/${objectiveProgress.completionValue}`} className="challengeProgress"
                        />
                    </div>
                );
            });
        }
    }

    checkCompletion(allObjectiveData) {
        //return true if all objectives in challenge completed
        if (allObjectiveData == null) return false;
        for(let i=0; i<allObjectiveData.length; i++) {
            if (!allObjectiveData[i].objectiveProgress.complete) {
                return false;
            }
        }
        return true;
    }

    renderRewards(rewardData) {
        if (rewardData == null) {
            return (
                <div></div>
            );
        }
        return rewardData.map(({rewardInfo}) => {
            return (
                <div className="vendorRankInfo" key={rewardInfo.hash}>
                    <img src={`https://www.bungie.net${rewardInfo.displayProperties.icon}`} className='rewardIcon' alt='reward icon'/>
                    {rewardInfo.displayProperties.name} 
                </div>
            );
        });
    }

    renderSeasonalChallengesforCategory() {
        return this.props.seasonalChallenges.allSeasonalChallengesInfo.map(week => {
            return (
                <Tab.Pane eventKey={week.weekCategoryInfo.displayProperties.name} key={week.weekCategoryInfo.displayProperties.name}>
                    {week.categoryData.map(({allObjectiveData, recordInfo, rewardData}) => {
                        if (this.props.seasonalChallengeVisibility
                            && this.checkCompletion(allObjectiveData)) {
                            //skip completed challenges
                        } else if (allObjectiveData == null) {
                            //check for classified challenges
                            return (
                                <div className='seasonalChallengeInfo' key={recordInfo.hash}>
                                    <div className="vendorRankInfo">
                                        <img src={`https://www.bungie.net${recordInfo.displayProperties.icon}`} className='vendorIcon' alt='vendor icon'/>
                                        <h4>{recordInfo.displayProperties.name}</h4>
                                    </div>
                                    {recordInfo.displayProperties.description}
                                    <div>
                                        {this.renderObjectives(allObjectiveData)}
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div className='seasonalChallengeInfo' key={recordInfo.hash}>
                                    <div className="vendorRankInfo">
                                        <img src={`https://www.bungie.net${recordInfo.displayProperties.icon}`} className='vendorIcon' alt='vendor rank icon'/>
                                        <h4>{recordInfo.displayProperties.name}</h4>
                                    </div>
                                    {recordInfo.displayProperties.description}
                                    <div>
                                        {this.renderObjectives(allObjectiveData)}
                                    </div>
                                    <hr />
                                    <div>
                                        Rewards:
                                        {this.renderRewards(rewardData)}
                                    </div>
                                </div>
                            );
                        }
                    })}
                </Tab.Pane>
            );
        });
    }

    renderSeasonalChallengeCategories() {
        return this.props.seasonalChallenges.allSeasonalChallengesInfo.map(week => {
            return (
                <Nav.Item key={week.weekCategoryInfo.hash}>
                    <Nav.Link eventKey={week.weekCategoryInfo.displayProperties.name}>
                        {week.weekCategoryInfo.displayProperties.name}
                    </Nav.Link>
                </Nav.Item>
            );
        });
    }

    handleChange = (e) => {
        this.props.setCompletedChallengedVisibility();
    }

    render() {
        if (this.props.seasonalChallenges.hasOwnProperty('seasonalChallengesData')) {
            return (
                <div>
                    <div className="vendorRankInfo">
                        <img src={`https://www.bungie.net${this.props.seasonalChallenges.seasonInfo.displayProperties.icon}`} className="headerIcon" alt='seasonal icon'/>
                        <h2>{this.props.seasonalChallenges.seasonInfo.displayProperties.name}</h2>
                        <div className="checkboxAndLabel">
                            <label>
                                <input 
                                    type="checkbox"
                                    checked={this.props.seasonalChallengeVisibility} 
                                    onChange={this.handleChange}
                                />
                                <span className="fieldLabel">Hide Completed</span>
                            </label>
                        </div>
                    </div>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="Seasonal">
                        <Row className="seasonalChallenges">
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    {this.renderSeasonalChallengeCategories()}
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    {this.renderSeasonalChallengesforCategory()}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            );  
        }
    }
}

function mapStateToProps({seasonalChallenges, currChar, seasonalChallengeVisibility}) {
    return { seasonalChallenges, currChar, seasonalChallengeVisibility };
}

export default connect(mapStateToProps, { setCompletedChallengedVisibility })(SeasonalChallenges);