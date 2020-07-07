import React from "react";
import {connect} from "react-redux";
import {initiateUserUpdate} from "../../../actions";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const mapStateToProps = (state) => {
    return {...state};
};

const mapDispatchToProps = (dispatch) => {
    return {
        initiateUserUpdate: (id, phone) => dispatch(initiateUserUpdate(id, phone))
    };
};

class UserSettings extends React.Component {
    dataLoaded = false;
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            msg: '',
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
        const user = null === this.props.user ? localStorage.getItem('user') : this.props.user;
        this.props.initiateUserUpdate(user.split('/').pop(), this.state.phone);
    }
    componentDidMount() {
        if (this.props.userFetchFinished && !this.dataLoaded) {
            this.setState({
                phone: this.props.userData.phoneNumber
            });
            this.dataLoaded = true;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userFetchFinished && !this.dataLoaded) {
            this.setState({
                phone: this.props.userData.phoneNumber
            });
            this.dataLoaded = true;
        }
        if (this.props.mainActionFinished && this.state.msg !== 'User profile updated succesfuly') {
            this.setState({
                msg: 'User profile updated succesfuly'
            });

        }
    }

    render() {
        let error = '';
        if (this.props.error) {
            if (
                this.props.error.response
                && this.props.error.response.data
                && this.props.error.response.data.error
            ) {
                error = <p>{this.props.error.response.data.error}</p>
            } else {
                error = <p>{this.props.error.message}</p>
            }
        }
        const phone = this.state.phone ? this.state.phone : '';

        return (
            <div>
                <h1>Profile</h1>
                <p>{this.state.msg}</p>
                <Form>
                    <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control onChange={this.handleChange} value={phone} type="text" placeholder="Enter your phone" name="phone" id="phone" />
                        <Form.Text className="text-muted">
                            This one is only for admin contact and is only visible to owner(you) and admin
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" onClick={this.handleSubmit} type="submit">Update</Button>
                    {error}
                </Form>
            </div>
        );
    }
}
const connectedUserSettings = connect(mapStateToProps, mapDispatchToProps)(UserSettings);
export default connectedUserSettings;
