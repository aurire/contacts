import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";
import {STORE_NAME} from "../constants/strings";

class UnloggedNavigation extends React.Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                <Navbar.Brand>{STORE_NAME}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} disabled={'login' === this.props.activeLink} to="/">Login</Nav.Link>
                        <Nav.Link as={Link} disabled={'register' === this.props.activeLink} to="/register">Register</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

        );
    }
}

export default UnloggedNavigation;