import React, { Component } from "react";
import { connect } from 'react-redux';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

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
                <ListGroup key={bucketInfo.hash} horizontal className="vendorBucket">
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
        console.log(this.props.currChar, this.props.vendors);
        if(this.props.currChar && this.props.vendors) {
            return this.props.vendors.map(({vendorGroup, groupInfo}) => {
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
        }
    }

    render() {
        return (
            <div>
                <Accordion defaultActiveKey={['0']} alwaysOpen>
                    {/* should refresh when new character selected */}
                    {this.renderVendors()}
                </Accordion>
            </div>
        );
    }
}

function mapStateToProps({vendors, currChar}) {
    return { vendors, currChar };
}

export default connect(mapStateToProps, null)(VendorList);