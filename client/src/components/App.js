import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Container from 'react-bootstrap/Container';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Vendors from './vendors/Vendors';
import Footer from './Footer';
import WeeklyActivities from './activities/WeeklyActivities';
import DailyRotations from './activities/DailyRotations';
import WeeklyRotations from './activities/WeeklyRotations';
import Progress from './Progress';

class App extends Component {
    componentDidMount() {
        //checks if current user signs in when app loads
        this.props.fetchUser();
        // this.props.checkForNewManifestVersion();
    }

    // componentDidUpdate(prevProps) {
    //     this.props.checkForNewManifestVersion();
    // }

    render() {
        return (
            <Container>
                <div style={{backgroundColor: 'white', paddingBottom: '20px'}}>
                    <BrowserRouter>
                        <div>
                            <Header/>
                            <div style={{paddingLeft: '5px'}}>
                                <Route exact path="/" component={Landing}/>
                                <Route exact path="/dashboard" component={Dashboard}/>
                                <Route exact path="/vendors" component={Vendors}/>
                                <Route exact path="/challenges" component={WeeklyActivities}/>
                                <Route exact path="/daily" component={DailyRotations}/>
                                <Route exact path="/weekly" component={WeeklyRotations}/>
                                <Route exact path="/progress" component={Progress}/>
                            </div>
                            <Footer/>
                        </div>
                    </BrowserRouter>
                </div>
            </Container>
        );
    }
};

export default connect(null, actions)(App);