import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class VendorRanks extends Component {
    calculateMaxRankPoints(rankSteps) {
        let maxPoints = 0;
        for (let i=0; i<rankSteps.length; i++) {
            maxPoints += rankSteps[i].progressTotal;
        }
        return maxPoints;
    }

    renderTooltip(props) {
        return (<Tooltip id="button-tooltip" {...props}>
            Bungie.net reports the Vanguard reset count under Strange Favor (Dares of Eternity)
        </Tooltip>);
    }

    renderResets(vendor) {
        if (vendor.progression.hasOwnProperty('currentResetCount')) {
            if (vendor.vendorHash === 3442679730) {  //strange favor
                return (
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={this.renderTooltip}
                    >
                        <div>Times Reset: {vendor.progression.currentResetCount} - !</div>
                    </OverlayTrigger>
                );
            }
            return (<div>Times Reset: {vendor.progression.currentResetCount}</div>);
        }
    }

    renderRankImg(rankInfo) {
        if (rankInfo.hasOwnProperty('rankIcon')) {
            return (<img src={`https://www.bungie.net${rankInfo.rankIcon}`} className='pointsIcon' alt='rank points icon'/>);
        }
    }

    renderRankIcon(rankInfo, currStep) {
        if (rankInfo.displayProperties.hasIcon) {
            const imgSrc = rankInfo.steps[currStep].icon ? `https://www.bungie.net${rankInfo.steps[currStep].icon}` : `https://www.bungie.net${rankInfo.displayProperties.icon}`;
            return (<img src={imgSrc} className="rankIcon" alt='rank icon'/>);
        }
    }

    renderStreak(progressInfo) {
        if (progressInfo) {
            let renderedContent = [];
            for (let i=0; i<5; i++) {
                if (i < progressInfo.currentProgress) {
                    renderedContent.push(
                        <div className='streakBox' key={i}>
                            <div className='streakBoxComplete'></div>
                        </div>
                    );
                } else {
                    renderedContent.push(<div className='streakBox' key={i}></div>);
                }
            }
            return (<div className='streakRow'>{renderedContent}</div>);
        }
    }

    renderVendorRanks() {
        if (this.props.vendorRanks && this.props.vendorRanks.length > 0) {
            return this.props.vendorRanks.map(({rankInfo, vendor, progressInfo}) => {
                const rankColor = rankInfo.hasOwnProperty('color') ? `rgba(${rankInfo.color.red}, ${rankInfo.color.green}, ${rankInfo.color.blue}, ${rankInfo.color.alpha})` : '#ff8552';
                return (
                    <div key={rankInfo.hash} className='vendorRankInfo'>
                        <div>
                            <div className="progressBars">
                                <CircularProgressbarWithChildren
                                    value={vendor.progression.currentProgress}
                                    maxValue={this.calculateMaxRankPoints(rankInfo.steps)}
                                    strokeWidth={8}
                                    styles={buildStyles({
                                        pathColor: `${rankColor}`,
                                        trailColor: "transparent"
                                    })}
                                >
                                    {/* Width here needs to be (100 - 2 * strokeWidth)% 
                                        in order to fit exactly inside the outer progressbar. */}
                                    <div style={{ width: "84%" }}>
                                        <CircularProgressbarWithChildren
                                            value={vendor.progression.progressToNextLevel}
                                            maxValue={vendor.progression.nextLevelAt}
                                            strokeWidth={10}
                                            styles={buildStyles({
                                                trailColor: "transparent"
                                            })}
                                        >
                                            {this.renderRankIcon(rankInfo, vendor.progression.stepIndex)}
                                        </CircularProgressbarWithChildren>
                                    </div>
                                </CircularProgressbarWithChildren>
                            </div>
                            {this.renderStreak(progressInfo)}
                        </div>
                        <div>
                            {rankInfo.displayProperties.name} {vendor.progression.level + 1}
                            <div>{rankInfo.steps[vendor.progression.stepIndex].stepName}</div>
                            <div>
                                {this.renderRankImg(rankInfo)}
                                {vendor.progression.currentProgress} ({vendor.progression.progressToNextLevel}/{vendor.progression.nextLevelAt})
                            </div>
                            {this.renderResets(vendor)}
                        </div>
                    </div>
                )
            });
        }
    }

    render() {
        return (
            <div className='vendorRanks'>
                {this.renderVendorRanks()}
            </div>
        );
    }
};

function mapStateToProps({vendorRanks, currChar}) {
    return { vendorRanks, currChar };
}

export default connect(mapStateToProps, null)(VendorRanks);