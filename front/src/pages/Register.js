import React from "react";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {initiateRegister, setAlert} from "../actions";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import UnloggedNavigation from "../components/UnloggedNavigation";

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
            this.props.history.push('/user/contacts/list/1');
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
                <UnloggedNavigation activeLink="register" />
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
