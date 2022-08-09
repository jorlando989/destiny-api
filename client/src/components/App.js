import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import background from '../imgs/destiny2travelerbackground.png';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
const Vendors = () => <h2>Vendors</h2>;

class App extends Component {
    componentDidMount() {
        //checks if current user signs in when app loads
        this.props.fetchUser();
    }

    render() {
        return (
            <div style={{backgroundImage: `url(${background})`, height: '100%', backgroundSize: 'cover', backgroundRepeat: 'repeat'}}>
                <div className='container' style={{backgroundColor: 'white', paddingBottom: '20px'}}>
                    <BrowserRouter>
                        <div>
                            <Header />
                            <Route exact path="/" component={Landing}/>
                            <Route exact path="/dashboard" component={Dashboard}/>
                            <Route exact path="/vendors" component={Vendors}/>
                        </div>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
};

export default connect(null, actions)(App);