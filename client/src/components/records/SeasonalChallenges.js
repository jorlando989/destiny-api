import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchSeasonalChallenges, setCompletedChallengedVisibility } from '../../actions';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import ProgressBar from 'react-bootstrap/ProgressBar';

class SeasonalChallenges extends Component {
    componentDidMount() {
        this.props.fetchSeasonalChallenges();
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
        for(let i=0; i<allObjectiveData.length; i++) {
            if (!allObjectiveData[i].objectiveProgress.complete) {
                return false;
            }
        }
        return true;
    }

    renderRewards(rewardData) {
        return rewardData.map(({rewardInfo}) => {
            const imgSrc = `https://www.bungie.net${rewardInfo.displayProperties.icon}`;
            return (
                <div className="vendorRankInfo" key={rewardInfo.hash}>
                    <img src={imgSrc} className='rewardIcon'/>
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
                        const imgSrc = `https://www.bungie.net${recordInfo.displayProperties.icon}`;
                        if (this.props.seasonalChallengeVisibility
                            && this.checkCompletion(allObjectiveData)) {
                            //skip completed challenges
                        } else {
                            return (
                                <div className='seasonalChallengeInfo' key={recordInfo.hash}>
                                    <div className="vendorRankInfo">
                                        <img src={imgSrc} className='vendorIcon'/>
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
        console.log(this.props.seasonalChallenges);
        if (this.props.seasonalChallenges.hasOwnProperty('seasonalChallengesData')) {
            const imgSrc = `https://www.bungie.net${this.props.seasonalChallenges.seasonInfo.displayProperties.icon}`;
            return (
                <div>
                    <div className="vendorRankInfo">
                        <img src={imgSrc} className="headerIcon"/>
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
                    <Tab.Container id="left-tabs-example" defaultActiveKey="Week 1">
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

export default connect(mapStateToProps, { fetchSeasonalChallenges, setCompletedChallengedVisibility })(SeasonalChallenges);