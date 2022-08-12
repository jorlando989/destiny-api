import React, { Component } from 'react';

import CharacterSelector from '../CharacterSelector';
import VendorList from './VendorList';


class Vendors extends Component {
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

export default Vendors;