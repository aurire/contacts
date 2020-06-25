import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchSharedForUser, setAlert} from "../../../../actions";
import ListGroup from "react-bootstrap/ListGroup";

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSharedForUser: (id, page) => dispatch(fetchSharedForUser(id, page)),
        setAlert: (msg) => dispatch(setAlert(msg))
    };
};

const mapStateToProps = (state) => {
    return {...state};
};


class ContactsSharedWithMe extends React.Component {
    componentDidMount() {
        let user = this.props.user;
        if (null === user) {
            user = localStorage.getItem('user');
        }
        this.props.fetchSharedForUser(user, 1);
    }

    getContacts() {
        if (this.props.shared[this.props.match.params.id]) {
            let contacts = this.props.shared[this.props.match.params.id]['hydra:member'];

            console.log(contacts);

            const listItems = contacts.map((contact) =>
                <ListGroup.Item key={contact['contact']['@id']}>
                    <h5>{contact['contactOwner']}<span> </span>
                        <span style={{fontWeight: "normal", fontSize: "small"}}>{
                            new Intl.DateTimeFormat(
                                "en-GB",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit",
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric'
                                }
                            ).format(new Date(contact['contact']['createdAt']))
                        }</span>
                    </h5>
                    <p><b>{contact['contact']['name']}</b></p>
                    <p>{contact['contact']['phone']}</p>
                </ListGroup.Item>
            );

            return (
                <ListGroup>
                    {listItems}
                </ListGroup>
            );
        }

        return '';
    }

    getPager() {
        return '';
    }

    render() {
        return (
            <div>
                <h1>Contacts shared with me</h1>
                {this.getContacts()}
                {this.getPager()}
            </div>
        );
    }
}

const ConnectedContactsSharedWithMe = connect(mapStateToProps, mapDispatchToProps)(ContactsSharedWithMe);
export default withRouter(ConnectedContactsSharedWithMe);
