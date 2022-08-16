import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

class Header extends Component {
    renderContent() {
        switch (this.props.auth) {
            case null:
                return;
            case false:
                return <li><a href="/auth/bungie">Login</a></li>;
                // <Nav.Link href="/auth/bungie">Login</Nav.Link>
            default:
                return [
                    <Nav.Link href="/vendors" key="vendors">Vendors</Nav.Link>,
                    <NavDropdown title="Activities" key="activities">
                        <NavDropdown.Item href="">Daily Activities</NavDropdown.Item>
                        <NavDropdown.Item href="">Weekly Activities</NavDropdown.Item>
                    </NavDropdown>,
                    <Nav.Link href="/api/logout" key="logout">Logout</Nav.Link>
                ];
        };
    }

    render() {
        return (
            <nav>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href={this.props.auth ? "/dashboard" : "/" }>
                            Destiny-API
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                {this.renderContent()}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </nav>
        );
    }
};

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);