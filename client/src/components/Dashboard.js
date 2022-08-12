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
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Button variant="primary" className="card-button" href="/vendors">View all Vendors</Button>
                    </Card.Body>
                </Card>
                <Card style={{width: '18rem'}}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Button variant="primary" className="card-button">View Weekly Activities</Button>
                    </Card.Body>
                </Card>
                <Card style={{width: '18rem'}}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Button variant="primary" className="card-button">View Daily Activities</Button>
                    </Card.Body>
                </Card>
            </CardGroup>
        </div>
    );
};

export default Dashboard;