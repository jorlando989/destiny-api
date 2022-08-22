import React, { Component } from "react";
import { connect } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

class VendorList extends Component {
    renderVendorItems(saleInfo) {
        return saleInfo.map(({bucketInfo, group}) => {
            const renderedGroup = group.map(item => {
                const saleItemIcon = item.itemInfo.displayProperties.hasIcon ? `https://www.bungie.net${item.itemInfo.displayProperties.icon}` : null;
                return (
                    <img src={saleItemIcon} alt="item icon" key={item.itemInfo.displayProperties.name + item.vendorItemIndex} />
                );
            });
            return (
                <ListGroup key={bucketInfo.displayCategoryHash} horizontal className="vendorBucket">
                    <ListGroup.Item className="groupTitle">{bucketInfo.displayProperties.name}</ListGroup.Item>
                    <ListGroup.Item>{renderedGroup}</ListGroup.Item>
                </ListGroup>
            );
        });
    }

    renderGroupVendors(groupInfo) {
        return groupInfo.map(({vendorInfo, locationInfo, saleInfo}) => {
            const imgSrc = `https://www.bungie.net${vendorInfo.displayProperties.smallTransparentIcon}`;
            return (
                <Accordion.Item key={vendorInfo.vendorIdentifier} eventKey={vendorInfo.vendorIdentifier}>
                    <Accordion.Header className="vendorHeader">
                        <img src={imgSrc} alt="vendor icon" className="vendorIcon"></img>
                        {vendorInfo.displayProperties.name} - <i>{locationInfo[0].displayProperties.name}</i>
                    </Accordion.Header>
                    <Accordion.Body>
                        {this.renderVendorItems(saleInfo)}
                    </Accordion.Body>
                </Accordion.Item>
            );
        });
    }

    renderVendors() {
        if(this.props.currChar && this.props.vendors) {
            const renderedVendors = this.props.vendors.map(({vendorGroup, groupInfo}) => {
                return (
                    <Accordion.Item key={vendorGroup.hash} eventKey={vendorGroup.hash}>
                        <Accordion.Header>{vendorGroup.categoryName}</Accordion.Header>
                        <Accordion.Body>
                            <Accordion defaultActiveKey={['0']} alwaysOpen>
                                {this.renderGroupVendors(groupInfo)}
                            </Accordion>
                        </Accordion.Body>
                    </Accordion.Item>
                );
            });
            return (
                <Accordion defaultActiveKey={['0']} alwaysOpen>
                    {renderedVendors}
                </Accordion>
            );
        } else if (this.props.currChar) {
            return (
                <div className='loadingSpinner'>
                    <Spinner animation="border"/>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderVendors()}
            </div>
        );
    }
}

function mapStateToProps({vendors, currChar}) {
    return { vendors, currChar };
}

export default connect(mapStateToProps, null)(VendorList);