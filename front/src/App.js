import React from "react";
import {
    BrowserRouter as Router,
} from "react-router-dom";
import AppRouter from "./AppRouter";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

class App extends React.Component {
    render() {
        return (
            <Container className="p-3">
                <Jumbotron>
                <Router>
                    <AppRouter />
                </Router>
                </Jumbotron>
            </Container>
        );
    }
};

export default App;
