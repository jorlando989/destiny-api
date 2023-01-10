import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchSeasonalArtifact, fetchSeasonPass } from '../../actions';
import ProgressBar from 'react-bootstrap/ProgressBar';

class SeasonalArtifact extends Component {
    componentDidMount() {
        this.props.fetchSeasonalArtifact();
        this.props.fetchSeasonPass();
    }

    renderSeasonPassProgression() {
        const {seasonPassProgression, prestigeSeasonPassProgression} = this.props.seasonPass;
        let currLevel = seasonPassProgression.level;
        let nextLevel = seasonPassProgression.nextLevelAt;
        let nextLevelProgress = seasonPassProgression.progressToNextLevel;
        if (seasonPassProgression.level === seasonPassProgression.levelCap) {
            currLevel += prestigeSeasonPassProgression.level;
            nextLevel = prestigeSeasonPassProgression.nextLevelAt;
            nextLevelProgress = prestigeSeasonPassProgression.progressToNextLevel;
        }
        return (
            <div>
                Season Rank {currLevel}
                <ProgressBar 
                    now={currLevel} 
                    max={seasonPassProgression.levelCap} 
                    label={`${currLevel}/${seasonPassProgression.levelCap}`} 
                    className="challengeProgress"
                />
                Next Level At:
                <ProgressBar 
                    now={nextLevelProgress} 
                    max={nextLevel}
                    className="challengeProgress"
                />
                <div className='smallLabel'>
                    <i>{nextLevelProgress}/{nextLevel}</i>
                </div>
            </div>
        );
    }

    render() {
        if (this.props.seasonalArtifact && this.props.seasonPass) {
            const {artifactInfo, seasonalArtifactProgression} = this.props.seasonalArtifact;
            return (
                <div className='seasonPassGrid'>
                    <div className='img-item'>
                        <img className='artifactIcon' src={`https://www.bungie.net${artifactInfo.displayProperties.icon}`} alt='seasonal artifact icon'/>
                    </div>
                    <div className="row-item right-border">
                        <h5>{artifactInfo.displayProperties.name}</h5>
                        {this.renderSeasonPassProgression()}
                    </div>
                    <div className="row-item right-border">
                        <h5>Artifact Unlocks</h5>
                        <ProgressBar 
                            now={seasonalArtifactProgression.pointProgression.level} 
                            max={seasonalArtifactProgression.pointProgression.levelCap} 
                            label={`${seasonalArtifactProgression.pointProgression.level}/${seasonalArtifactProgression.pointProgression.levelCap}`} 
                            className="challengeProgress"
                        />
                        Next Unlock Progress:
                        <ProgressBar 
                            now={seasonalArtifactProgression.pointProgression.progressToNextLevel} 
                            max={seasonalArtifactProgression.pointProgression.nextLevelAt} 
                            className="challengeProgress"
                        />
                        <div className='smallLabel'>
                            <i>{seasonalArtifactProgression.pointProgression.progressToNextLevel}/{seasonalArtifactProgression.pointProgression.nextLevelAt}</i>
                        </div>
                    </div>
                    <div className="row-item">
                        <h5>Power Bonus</h5>
                        Current Bonus: {seasonalArtifactProgression.powerBonusProgression.level}
                        <ProgressBar 
                            now={seasonalArtifactProgression.powerBonusProgression.progressToNextLevel} 
                            max={seasonalArtifactProgression.powerBonusProgression.nextLevelAt} 
                            className="challengeProgress"
                        />
                        <div className='smallLabel'>
                            <i>{seasonalArtifactProgression.powerBonusProgression.progressToNextLevel}/{seasonalArtifactProgression.powerBonusProgression.nextLevelAt}</i>
                        </div>
                    </div>
                </div>
            );
        }
        
    }
}

function mapStateToProps({seasonalArtifact, seasonPass}) {
    return { seasonalArtifact, seasonPass };
}

export default connect(mapStateToProps, { fetchSeasonalArtifact, fetchSeasonPass })(SeasonalArtifact);