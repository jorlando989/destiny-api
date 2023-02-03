import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchStrikeModifiers } from "../../actions";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class StrikeModifiers extends Component {
	componentDidMount() {
		this.props.fetchStrikeModifiers();
	}

	renderModifiers() {
		return this.props.strikeModifiers.modifiers.map(modifier => {
			return (
				<div>
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
							className='iconImage'
							alt='strike modifier icon'
						/>
					</OverlayTrigger>
				</div>
			);
		});
	}

	render() {
		if (this.props.strikeModifiers.hasOwnProperty("modifiers")) {
			return (
				<div className='bg-teal itemCard min-width rounded-corners whiteText'>
					<div className='display-in-row'>
						{this.renderModifiers()}
					</div>
				</div>
			);
		}
	}
}

function mapStateToProps({ strikeModifiers }) {
	return { strikeModifiers };
}

export default connect(mapStateToProps, { fetchStrikeModifiers })(
	StrikeModifiers
);
