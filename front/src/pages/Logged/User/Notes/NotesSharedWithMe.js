import React from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
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


class NotesSharedWithMe extends React.Component {
    componentDidMount() {
        let user = this.props.user;
        if (null === user) {
            user = localStorage.getItem('user');
        }
        this.props.fetchSharedForUser(user, 1);
    }

    getNotes() {
        if (this.props.shared[this.props.match.params.id]) {
            let notes = this.props.shared[this.props.match.params.id]['hydra:member'];

            const listItems = notes.map((note) =>
                <ListGroup.Item key={note['note']['@id']}>
                    <h5>{note['noteOwner']}<span> </span>
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
                            ).format(new Date(note['note']['createdAt']))
                        }</span>
                    </h5>
                    <p><b>{note['note']['title']}</b></p>
                    <p>{note['note']['message']}</p>
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
                <h1>Notes shared with me</h1>
                {this.getNotes()}
                {this.getPager()}
            </div>
        );
    }
}

const ConnectedNotesSharedWithMe = connect(mapStateToProps, mapDispatchToProps)(NotesSharedWithMe);
export default withRouter(ConnectedNotesSharedWithMe);
