import React from "react";
import {connect} from 'react-redux';
import {initiateContactShare, setAlert, fetchByEmail} from "../../../../actions";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const mapDispatchToProps = (dispatch) => {
    return {
        initiateContactShare: (contact, user) => dispatch(initiateContactShare(contact, user)),
        setAlert: (msg) => dispatch(setAlert(msg)),
        fetchByEmail: (email, page) => dispatch(fetchByEmail(email, page))
    };
};

const mapStateToProps = (state) => {
    return {...state};
};

class ContactsShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            userid: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.handleShareSubmit = this.handleShareSubmit.bind(this);
        this.getResults = this.getResults.bind(this);
    }
    handleChange(event) {
        this.setState({
            ...this.state,
            [event.target.id]: event.target.value
        });
    }
    handleSearchSubmit(event) {
        event.preventDefault();
        this.props.fetchByEmail(this.state.user, 1);

        return false;
    }
    handleShareSubmit(event) {
        event.preventDefault();
        this.props.initiateContactShare(
            "/api/contacts/" + this.props.match.params.id,
            this.state.userid
        );

        return false;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (true === this.props.loaded) {
            if (true === this.props.mainActionFinished) {
                this.props.setAlert('Contact shared succesfuly');
                this.props.history.push('/user/contacts/list/1');
            }
        }
    }

    getForm() {
        let error = '';
        if (this.props.error !== null) {
            if (
                this.props.error.response
                && this.props.error.response.data
                && this.props.error.response.data.error
            ) {
                error = <p>{this.props.error.response.data.error}</p>
            } else if (
                this.props.error.response
                && this.props.error.response.data
            ) {
                error = <p>{this.props.error.response.data['hydra:description'].replace(/^contact\:\s/, "")}</p>
            } else {
                error = <p>{this.props.error.message}</p>
            }
        }

        return (
            <div>
                <Form onSubmit={this.handleSearchSubmit}>
                    <Form.Group>
                        <Form.Label>Search by user email</Form.Label>
                        <Form.Control onChange={this.handleChange} value={this.state.title} type="text" placeholder="Enter user email" name="user" id="user" />
                        <Form.Text className="text-muted">
                            Enter at least the portion of email you want to share a contact with
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">Search</Button>
                </Form>
                <p>{error}</p>
            </div>
        );
    }
    getResults() {
        if (this.props.search[this.state.user]) {
            let res = this.props.search[this.state.user][1]['hydra:member'];

            const results = res.map(function(result) {

                return <option value={result['@id']} key={result['@id']}>{result.email}</option>;
            });

            return (
                <Form onSubmit={this.handleShareSubmit}>
                    <Form.Group>
                        <Form.Label>Select a user</Form.Label>
                        <Form.Control as="select" custom id="userid" name="userid"  onChange={this.handleChange}>
                            {results}
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select specific user by email you want to share a contact with
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">Share</Button>
                </Form>
            );
        }

        return '';
    }
    render() {
        return (
            <div>
                <h1>Share a contact</h1>
                {this.getForm()}
                {this.getResults()}
            </div>
        );
    }
}

const ConnectedContactsShare = connect(mapStateToProps, mapDispatchToProps)(ContactsShare);
export default ConnectedContactsShare;
