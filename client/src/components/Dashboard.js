import React from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const Dashboard = () => {
    return (
        <div>
            <h2>Dashboard</h2>
            <CardGroup>
                <Card style={{width: '18rem'}}>
                    <Card.Body>
                        <Button className="card-button" href="/vendors">View all Vendors</Button>
                    </Card.Body>
                </Card>
                <Card style={{width: '18rem'}}>
                    <Card.Body>
                        <Button className="card-button" href="/challenges">View Weekly Challenges</Button>
                    </Card.Body>
                </Card>
                <Card style={{width: '18rem'}}>
                    <Card.Body>
                        <Button className="card-button" href="">View Daily Rotations</Button>
                        <Button className="card-button" href="">View Weekly Rotations</Button>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    );
};

export default Dashboard;