import React, { Component } from "react";
import { connect } from 'react-redux';
import { fetchVendors } from '../../actions';

class VendorList extends Component {
    componentDidMount() {
        this.props.fetchVendors();
    }

    renderVendors() {
        //get list of vendors from backend
        return this.props.vendors.map(vendor => {
            return (
                <div></div>
            );
        });
    }

    render() {
        return (
            <div>
                {/* {this.renderVendors()} */}
            </div>
        );
    }
}

function mapStateToProps({vendors}) {
    return { vendors };
}

export default connect(mapStateToProps, {fetchVendors})(VendorList);