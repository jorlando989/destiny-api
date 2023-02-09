import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchWeeklyNightfall, fetchNightfallWeapon } from "../../actions";

import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class WeeklyNightfall extends Component {
    componentDidMount() {
        this.props.fetchWeeklyNightfall();
        this.props.fetchNightfallWeapon();
    }

    renderDamageIcons(description) {
        const splitDesc = description.split(' ');
        const damageTypes = this.props.weeklyNightfall.DamageTypes;
        const renderedDesc = splitDesc.map(part => {
            switch (part) {
                case '[Solar]': 
                    return (<img key='solarIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Solar'].transparentIcon}`} alt='solar element icon'/>);
                case '[Void]':
                    return (<img key='voidIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Void'].transparentIcon}`} alt='void element icon'/>);
                case '[Arc]':
                    return (<img key='arcIcon' className='smallIcon' src={`https://www.bungie.net${damageTypes['Arc'].transparentIcon}`} alt='arc element icon'/>);
                default:
                    return ' ' + part + ' ';
            }
        });
        return renderedDesc;
    }

    renderBreakerIcons(description) {
        const splitDesc = description.split(' ');
        const breakerTypes = this.props.weeklyNightfall.BreakerTypes;
        const renderedDesc = splitDesc.map(part => {
            switch (part) {
                case '[Shield-Piercing]': 
                    return (<img key='shieldPiercingIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Shield-Piercing'].icon}`} alt='anti-barrier icon'/>);
                case '[Disruption]':
                    return (<img key='disruptionIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Disruption'].icon}`} alt='overload icon'/>);
                case '[Stagger]':
                    return (<img key='staggerIcon' className='smallIcon' src={`https://www.bungie.net${breakerTypes['Stagger'].icon}`} alt='unstoppable icon'/>);
                default:
                    return ' ' + part + ' ';
            }
        });
        return renderedDesc;
    }

    renderModifiers(modifiersInfo) {
        return modifiersInfo.map(modifier => {
            let renderedDescription = modifier.displayProperties.description;
            if(modifier.displayProperties.name === "Champion Foes") {
                renderedDescription = this.renderBreakerIcons(renderedDescription);
            }
            if (modifier.displayProperties.name === "Shielded Foes") {
                renderedDescription = this.renderDamageIcons(renderedDescription);
            }
            return (
                <div key={modifier.hash}>
                    <OverlayTrigger
						key={modifier.hash}
						placement='top'
						overlay={
							<Tooltip id='modifier description'>
								<b>{modifier.displayProperties.name}</b>
                                <hr />
                                {renderedDescription}
							</Tooltip>
						}
					>
						<img
							src={`https://www.bungie.net${modifier.displayProperties.icon}`}
							className='modifierIcon'
							alt='strike modifier icon'
						/>
					</OverlayTrigger>
                </div>
            );
        })
    }

    renderRewards(rewardsInfo) {
        return rewardsInfo.map(reward => {
            return (
                <div className="display-in-row" key={reward.hash}>
                    <img src={`https://www.bungie.net${reward.displayProperties.icon}`} className='vendorIcon' alt='reward icon'/>
                    {reward.displayProperties.name}
                </div>
            );
        })
    }

    renderNightfallLevelsCategories(nightfallLevels) {
        return nightfallLevels.map(({activityInfo}) => {
            return (
                <Nav.Item key={activityInfo.hash}>
                    <Nav.Link eventKey={activityInfo.displayProperties.name}>
                        {activityInfo.displayProperties.name}
                    </Nav.Link>
                </Nav.Item>
            );
        });
        
    }

    renderNightfallLevelsforCategory(nightfallLevels) {
        return nightfallLevels.map(({activityInfo, modifiersInfo, rewardsInfo}) => {
            return (
                <Tab.Pane eventKey={activityInfo.displayProperties.name} key={activityInfo.displayProperties.name}>
                    <div className="whiteText p10">
                        <i>{activityInfo.selectionScreenDisplayProperties.description}</i>
                        <div>
                            Modifiers: 
                            <div className="display-in-row-wrap">
                                {this.renderModifiers(modifiersInfo)}
                            </div>
                        </div>
                        <div>
                            Rewards: 
                            <div>
                                {this.renderRewards(rewardsInfo)}
                            </div>
                        </div>
                    </div>
                </Tab.Pane>
            );
        });
    }

    renderWeaponRotation() {
        if (this.props.nightfallWeapon) {
            return this.props.nightfallWeapon.weaponsInfo.map(({itemInfo, adeptItemInfo}) => {
                let classes = "display-in-row center-vertical";
                if (itemInfo.displayProperties.name == this.props.nightfallWeapon.currWeapon) {
                    classes = classes.concat(" currentWeapon");
                }
                return (
                    <div key={itemInfo.hash}>
                        <div className={classes}>
                            <img src={`https://www.bungie.net${itemInfo.displayProperties.icon}`} className='weaponIcon' alt='weapon icon'/>
                            {itemInfo.displayProperties.name}
                        </div>
                    </div>
                );
            })
        }
    }
    
    render() {
        if (this.props.weeklyNightfall) {
            return (
                <div className="display-in-row">
                    <div className="whiteText rounded-corners ml5 mr5 nightfallRow2 width60 bg-white">
                        <div className="ml5 bg-teal pb5">
                            <h3>{this.props.weeklyNightfall.nightfallLevels[0].activityInfo.displayProperties.description}</h3>
                        </div>
                        <div className="bg-white">
                            <Tab.Container id="left-tabs-example" defaultActiveKey="Nightfall: Adept">
                                <Row>
                                    <Col sm={3}>
                                        <Nav variant="pills" className="flex-column">
                                            {this.renderNightfallLevelsCategories(this.props.weeklyNightfall.nightfallLevels)}
                                        </Nav>
                                    </Col>
                                    <Col sm={9}>
                                        <Tab.Content>
                                            {this.renderNightfallLevelsforCategory(this.props.weeklyNightfall.nightfallLevels)}
                                        </Tab.Content>
                                    </Col>
                                </Row>
                            </Tab.Container>
                        </div>
                    </div>
                    <div className="nightfallRow1">
                        <h4>Nightfall Weapon Rotation</h4>
                        <hr />
                        <div>
                            {this.renderWeaponRotation()}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps({ weeklyNightfall, nightfallWeapon }) {
    return { weeklyNightfall, nightfallWeapon };
}

export default connect(mapStateToProps, { fetchWeeklyNightfall, fetchNightfallWeapon })(WeeklyNightfall);