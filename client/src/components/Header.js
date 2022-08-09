import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
    renderContent() {
        console.log('auth:', this.props.auth);
        switch (this.props.auth) {
            case null:
                return;
            case false:
                return <li><a href="/auth/bungie">Login</a></li>;
            default:
                return [
                    <li key="1"><a href="/api/logout">Logout</a></li>
                ];
        };
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <Link className="brand-logo left" to={this.props.auth ? "/dashboard" : "/" }>
                        Destiny-API
                    </Link>
                    <ul className="right">
                        {this.renderContent()}
                    </ul>
                </div>
            </nav>
        );
    }
};

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);