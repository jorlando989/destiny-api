import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectChar } from '../../actions';

import CharacterSelector from '../CharacterSelector';
import VendorList from './VendorList';

class Vendors extends Component {
    componentDidMount() {
        this.props.selectChar();
    }

    render() {
        return (
            <div>
                <h2>Vendors</h2>
                <CharacterSelector />
                <VendorList />
            </div>
        );
    }
};

export default connect(null, {selectChar})(Vendors);