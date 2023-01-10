import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    fetchCharacters, 
    selectChar, 
    fetchVendors, 
    fetchVendorRanks, 
    fetchSeasonalChallenges,
    fetchBounties,
    fetchVendorModsAda,
    fetchVendorModsBanshee
} from '../actions';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CharacterSelector extends Component {
    constructor() {
        super();
        this.renderSelectedChar = this.renderSelectedChar.bind(this);
        this.setSelectedChar = this.setSelectedChar.bind(this);
        this.state = {displaySelectedChar: false};
    }

    componentDidMount() {
        this.props.fetchCharacters();
    }

    renderCharacters() {
        return this.props.characters.map(char => {
            return (
                <Dropdown.Item key={char.characterID} eventKey={char.characterID}>
                    {char.lightLevel} - {char.race.displayProperties.name} {char.class.displayProperties.name}
                </Dropdown.Item>
            );
        });
    }

    setSelectedChar(e) {
        const selectedChar = this.props.characters.find(char => e === char.characterID);
        this.props.selectChar(selectedChar);
        this.setState({
            displaySelectedChar: true,
            selectedChar
        });
        //should this have to be called here? - shouldnt it automatically refresh on whatever pages are using the props
        this.props.fetchVendors();
        this.props.fetchVendorRanks();
        this.props.fetchSeasonalChallenges();
        this.props.fetchBounties();
        this.props.fetchVendorModsAda('Ada-1');
        this.props.fetchVendorModsBanshee('Banshee');
    }

    renderCharEmblem(selectedChar) {
        let titleClasses = 'titleText ';
        let gildedClasses = 'gildedIcon';
        if (selectedChar.gilded) {
            titleClasses = titleClasses.concat('gilded');
        } else {
            gildedClasses = gildedClasses.concat(' d-none');
        }
        return (
            <div className="emblem" style={{backgroundImage: `url('https://www.bungie.net${selectedChar.emblemFull}')`}}>
                <div className="emblemText">
                    <div>
                        <span className="lightLevel">{selectedChar.lightLevel}</span> - {selectedChar.race.displayProperties.name} {selectedChar.class.displayProperties.name}
                    </div>
                    <div className={titleClasses}>
                        <span className={gildedClasses}></span>
                        <i>{selectedChar.title.titleInfo.titlesByGender['Male']}</i>
                    </div>
                </div>
            </div>
        );
    }

    renderSelectedChar(){
        //if selectedChar saved in localstorage, render selected char
        if(this.state.displaySelectedChar){
            return this.renderCharEmblem(this.state.selectedChar);
        } else if (this.props.currChar) {
            return this.renderCharEmblem(this.props.currChar);
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col sm={3}>
                            <DropdownButton id="dropdown-basic" title="Select Character" onSelect={this.setSelectedChar}>
                                {this.renderCharacters()}
                            </DropdownButton>
                        </Col>
                        <Col sm={9}>
                            <div>{this.renderSelectedChar()}</div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
};

function mapStateToProps({characters, currChar}) {
    return { characters, currChar };
}

export default connect(mapStateToProps, {
    fetchCharacters, 
    selectChar, 
    fetchVendors, 
    fetchVendorRanks, 
    fetchSeasonalChallenges,
    fetchBounties,
    fetchVendorModsAda,
    fetchVendorModsBanshee
})(CharacterSelector);