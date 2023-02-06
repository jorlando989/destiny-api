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

    renderModifiers(modifiersInfo) {
        return modifiersInfo.map(modifier => {
            return (
                <div key={modifier.hash}>
                    <OverlayTrigger
						key={modifier.hash}
						placement='top'
						overlay={
							<Tooltip id='modifier description'>
								<b>{modifier.displayProperties.name}</b>
                                <hr />
                                {modifier.displayProperties.description}
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

    renderNightfallLevelsCategories() {
        return this.props.weeklyNightfall.map(({activityInfo, modifiersInfo}) => {
            return (
                <Nav.Item key={activityInfo.hash}>
                    <Nav.Link eventKey={activityInfo.displayProperties.name}>
                        {activityInfo.displayProperties.name}
                    </Nav.Link>
                </Nav.Item>
            );
        });
        
    }

    renderNightfallLevelsforCategory() {
        return this.props.weeklyNightfall.map(({activityInfo, modifiersInfo, rewardsInfo}) => {
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
                let classes = "display-in-row";
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
        if (this.props.weeklyNightfall && this.props.nightfallWeapon) {
            return (
                <div className="display-in-row">
                    <div className="whiteText rounded-corners ml5 mr5 nightfallRow2 width60 bg-white">
                        <div className="ml5 bg-teal pb5">
                            <h3>{this.props.weeklyNightfall[0].activityInfo.displayProperties.description}</h3>
                        </div>
                        <div className="bg-white">
                            <Tab.Container id="left-tabs-example" defaultActiveKey="Nightfall: Adept">
                                <Row>
                                    <Col sm={3}>
                                        <Nav variant="pills" className="flex-column">
                                            {this.renderNightfallLevelsCategories()}
                                        </Nav>
                                    </Col>
                                    <Col sm={9}>
                                        <Tab.Content>
                                            {this.renderNightfallLevelsforCategory()}
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