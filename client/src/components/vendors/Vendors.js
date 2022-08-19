import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectChar, fetchVendors } from '../../actions';

import CharacterSelector from '../CharacterSelector';
import VendorList from './VendorList';

class Vendors extends Component {
    componentDidMount() {
        //if character is set in local storage, use that as selectedChar
        this.props.selectChar();
        this.props.fetchVendors();
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

export default connect(null, {selectChar, fetchVendors})(Vendors);