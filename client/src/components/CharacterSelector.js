import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCharacters, selectChar, fetchVendors } from '../actions';
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
        this.props.fetchVendors();
    }

    renderSelectedChar(){
        //if selectedChar saved in localstorage, render selected char
        if(this.state.displaySelectedChar){
            const selectedChar = this.state.selectedChar;
            return (
                <div className="emblem" style={{backgroundImage: `url('https://www.bungie.net${selectedChar.emblemFull}')`}}>
                    <div className="emblemText">
                        <span className="lightLevel">{selectedChar.lightLevel}</span> - {selectedChar.race.displayProperties.name} {selectedChar.class.displayProperties.name}
                    </div>
                </div>
            );
        } else if (this.props.currChar) {
            const selectedChar = this.props.currChar;
            return (
                <div className="emblem" style={{backgroundImage: `url('https://www.bungie.net${selectedChar.emblemFull}')`}}>
                    <div className="emblemText">
                        <span className="lightLevel">{selectedChar.lightLevel}</span> - {selectedChar.race.displayProperties.name} {selectedChar.class.displayProperties.name}
                    </div>
                </div>
            );
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

export default connect(mapStateToProps, {fetchCharacters, selectChar, fetchVendors})(CharacterSelector);