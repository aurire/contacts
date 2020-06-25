import React from "react";
import {Link} from "react-router-dom";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {initiateRegister, setAlert} from "../actions";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const mapDispatchToProps = (dispatch) => {
    return {
        initiateRegister: (email, password) => dispatch(initiateRegister(email, password)),
        setAlert: (msg) => dispatch(setAlert(msg))
    };
};

const mapStateToProps = (state) => {
    return {...state};
};

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({
            ...this.state,
            [event.target.id]: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.initiateRegister(this.state.email, this.state.password);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (null !== this.props.userData) {
            this.props.history.push('/user/notes/list/1');
        }
        if (true === this.props.loaded) {
            this.props.setAlert('Succesfuly registered');
            this.props.history.push('/');
        }
    }

    render() {
        let error = '';
        if (this.props.error) {
            if (
                this.props.error.response
                && this.props.error.response.data
                && this.props.error.response.data['hydra:description']
            ) {
                error = <Alert variant="danger">
                    {this.props.error.response.data['hydra:description']}
                </Alert>;
            } else {
                error = <Alert variant="danger">
                    {this.props.error.message}
                </Alert>;
            }
        }

        return (
            <div>
                <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                    <Navbar.Brand>Notes sharing</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Login</Nav.Link>
                            <Nav.Link as={Link} disabled to="/register">Register</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <h1>Register</h1>
                <Form>
                    {error}
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control onChange={this.handleChange} value={this.state.email} type="email"
                                      placeholder="Enter your email" name="email" id="email" />
                        <Form.Text className="text-muted">
                            Please enter a valid email address
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.handleChange} value={this.state.password} type="password"
                                      placeholder="Enter your password" name="password" id="password" />
                        <Form.Text className="text-muted">
                            Any non empty password will be ok
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" onClick={this.handleSubmit} type="submit">Register</Button>
                </Form>
            </div>
        );
    }
}

const connectedRegister = connect(mapStateToProps, mapDispatchToProps)(Register);
export default withRouter(connectedRegister);
