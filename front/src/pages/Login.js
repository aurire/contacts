import React from "react";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {initiateLogin, getUserData} from "../actions";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

const mapDispatchToProps = (dispatch) => {
    return {
        initiateLogin: (email, password) => dispatch(initiateLogin(email, password)),
        getUserData: (id) => dispatch(getUserData(id))
    };
};

const mapStateToProps = (state) => {
    return {...state};
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        let user = localStorage.getItem('user');
        this.state = {
            email: '',
            password: '',
            user: user,
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
        this.props.initiateLogin(this.state.email, this.state.password);
    }
    componentDidMount() {
        if (this.state.user !== null) {
            this.props.getUserData(this.state.user);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userData !== null) {
            this.props.history.push('/user/notes/list/1');
        }
    }

    render() {
        let error = '';
        if (this.props.error !== null) {
            if (
                this.props.error.response
                && this.props.error.response.data
                && this.props.error.response.data.error
            ) {
                error =
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>You got an error!</strong>
                        <p>
                            {this.props.error.response.data.error}
                        </p>
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>;

            } else {
                error = <p>{this.props.error.message}</p>
            }
        }
        const alert = this.props.alert ? <Alert variant="info">{this.props.alert}</Alert> : '';

        return (
            <div>
                {alert}
                {error}
                <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                    <Navbar.Brand>Notes sharing</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} disabled to="/">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <h1>Login</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control onChange={this.handleChange} value={this.state.email} type="email"
                                      placeholder="Enter your email" name="email" id="email" />
                        <Form.Text className="text-muted">
                            Your registered email address
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.handleChange} value={this.state.password} type="password"
                                      placeholder="Enter your password" name="password" id="password" />
                        <Form.Text className="text-muted">
                            Your registration password
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" onClick={this.handleSubmit} type="submit">Login</Button>
                </Form>
            </div>
        );
    }
}

const connectedLogin = connect(mapStateToProps, mapDispatchToProps)(Login);
export default withRouter(connectedLogin);
