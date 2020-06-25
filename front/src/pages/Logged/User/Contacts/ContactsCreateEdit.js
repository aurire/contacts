import React from "react";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {initiateContactCreate, setAlert, fetchContact, initiateContactEdit, deleteShare} from "../../../../actions";
import {Link} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

const CREATE = 'Create';
const EDIT = 'Edit';

const mapDispatchToProps = (dispatch) => {
    return {
        initiateContactCreate: (ownerId, name, phone) => dispatch(initiateContactCreate(ownerId, name, phone)),
        initiateContactEdit: (ownerId, id, name, phone) => dispatch(initiateContactEdit(ownerId, id, name, phone)),
        deleteShare: (id) => dispatch(deleteShare(id)),
        fetchContact: (id) => dispatch(fetchContact(id)),
        setAlert: (msg) => dispatch(setAlert(msg))
    };
};

const mapStateToProps = (state) => {
    return {...state};
};

class ContactsCreateEdit extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            contactShares: null,
            error: null,
            refreshing: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleChange(event) {
        this.setState({
            ...this.state,
            [event.target.id]: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        if (CREATE === this.getCreateOrEdit()) {
            this.props.initiateContactCreate(
                this.props.user.split('/').pop(),
                this.state.name,
                this.state.phone
            );
        } else {
            this.props.initiateContactEdit(
                this.props.user.split('/').pop(),
                this.getContactId(),
                this.state.name,
                this.state.phone
            );
        }
    }
    handleDelete(event) {
        this.props.deleteShare(event.target.dataset.id.split('/').pop());
    }
    getCreateOrEdit() {
        if (this.props.match.params.id) {
            return EDIT;
        }

        return CREATE;
    }
    getContactId() {
        if (this.props.match.params.id) {
            return this.props.match.params.id;
        }

        return null;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (true === this.props.loaded) {
            if (true === this.props.mainActionFinished) {
                const msg = this.getCreateOrEdit() === CREATE
                    ? 'Succesfuly created Contact'
                    : 'Succesfuly updated Contact';
                this.props.setAlert(msg);
                this.props.history.push('/user/contacts/list/1');
            } else if (true === this.props.dataFetchFinished) {
                const thisContact = this.props.contact[this.getContactId()];
                if (thisContact && this.state.refreshing) {
                    this.setState(
                        {
                            ...this.state,
                            refreshing: false,
                            name: thisContact.name,
                            phone: thisContact.phone,
                            contactShares: thisContact.contactShares
                        }
                    );
                }
            }
            //need to check if main action is finished
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if (EDIT === this.getCreateOrEdit()) {
            const nid = this.getContactId();
            if (nid !== 'create') {
                this.setState({...this.setState, refreshing: true})
                this.props.fetchContact(nid);
            }
        }
        this.props.history.listen((location) => {
            if (location.pathname.split('/').pop() === 'create') {
                if (this._isMounted) {
                    this.setState({
                        name: '',
                        phone: '',
                        error: null,
                        refreshing: false
                    });
                }
            }
        });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getForm() {
        const error = '';
        if (this.state.refreshing) {
            return <div>Refreshing Contact data for editing</div>
        }

        return <Form>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={this.handleChange} value={this.state.name} type="text" placeholder="Enter name" name="name" id="name" />
                <Form.Text className="text-muted">
                    Your contact name
                </Form.Text>
            </Form.Group>
            <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control onChange={this.handleChange} value={this.state.phone} type="text" placeholder="Contact phone" name="phone" id="phone" />
                <Form.Text className="text-muted">
                    Contact phone number
                </Form.Text>
            </Form.Group>
            <Button variant="primary" onClick={this.handleSubmit} type="submit">{this.getCreateOrEdit() + " Contact"}</Button>
            {error}
        </Form>;
    }
    getContactShares() {
        if (null === this.state.contactShares) {
            return '';
        }
        const items = this.state.contactShares.map((contactShare) =>
            <ListGroup.Item key={contactShare['@id']}>
                {contactShare['user']['email']}<span> </span>
                {
                    this.props.deleted.hasOwnProperty(contactShare['@id'].split('/').pop())
                    ? ' - Sharing removed '
                    : <Button variant="outline-danger" onClick={this.handleDelete} className="share-delete" data-id={contactShare['@id']}>
                        Remove sharing</Button>
                }
            </ListGroup.Item>
        );

        return <div>
            <hr />
            <h2>Shared with:</h2>
            <ListGroup>
                {items}
            </ListGroup>
            <hr />
        </div>;
    }
    render() {

        const shareThis = EDIT === this.getCreateOrEdit()
            ? <Link to={"/user/contacts/share/" + this.props.match.params.id}>Share this contact</Link>
            : ''
        ;

        return (
            <div>
                <h1>{this.getCreateOrEdit()} Contact</h1>
                {this.getForm()}
                {this.getContactShares()}
                {shareThis}
            </div>
        );
    }
}

const connectedContactsCreateEdit = connect(mapStateToProps, mapDispatchToProps)(ContactsCreateEdit);
export default withRouter(connectedContactsCreateEdit);
