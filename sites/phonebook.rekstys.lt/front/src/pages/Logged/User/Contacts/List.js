import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import {fetchContactList, setAlert, deleteContact} from "../../../../actions";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "react-bootstrap/Pagination";

const mapDispatchToProps = (dispatch) => {
    return {
        fetchContactList: (owner, page) => dispatch(fetchContactList(owner, page)),
        deleteContact: (id) => dispatch(deleteContact(id)),
        setAlert: (msg) => dispatch(setAlert(msg))
    };
};

const mapStateToProps = (state) => {
    return {...state};
};

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: ''
        };
        this.onDeleteClick = this.onDeleteClick.bind(this);
    }
    onDeleteClick(event) {
        event.preventDefault();
        this.props.deleteContact(event.target.dataset.id.split('/').pop());
    }
    getContacts() {
        if (this.props.contacts[this.props.match.params.id]) {
            let contacts = this.props.contacts[this.props.match.params.id]['hydra:member'];

            const listItems = contacts.map((contact) =>
              <ListGroup.Item key={contact['@id']}>
                  <h5>{contact['name']} <span style={{fontWeight: "normal", fontSize: "small"}}>{
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
                      ).format(new Date(contact['createdAt']))
                  }</span></h5>
                  <p>{contact['phone']}</p>
                  <Link to={"/user/contacts/edit/" + contact['@id'].split('/').pop()}>Edit Contact</Link>
                  <span> | </span>
                  <Link to={"/user/contacts/share/" + contact['@id'].split('/').pop()}>Share Contact</Link>
                  <span> | </span>
                  <a href="#" data-id={contact['@id'].split('/').pop()} onClick={this.onDeleteClick} >Delete Contact</a>
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
        if (this.props.contacts[this.props.match.params.id]) {
            let view = this.props.contacts[this.props.match.params.id]['hydra:view'];
            if (false === view['@id'].includes('page=')) {
                return '';
            }
            const first = view['hydra:first']
                ? <Pagination.First>
                    <Link to={"/user/contacts/list/" + view['hydra:first'].split('page=').pop()}>
                        First
                    </Link>
                </Pagination.First>
                : ''
            ;

            const next = view['hydra:next']
                ? <>
                    <Pagination.Next>
                        <Link to={"/user/contacts/list/"
                        + view['hydra:next'].split('page=').pop()}>
                            Next
                        </Link>
                    </Pagination.Next>
                    <Pagination.Ellipsis />
                </>
                : ''
            ;
            const prev = view['hydra:previous']
                ? <>
                    <Pagination.Ellipsis />
                    <Pagination.Prev>
                        <Link to={"/user/contacts/list/"
                            + view['hydra:previous'].split('page=').pop()}>
                            Previous
                        </Link>
                    </Pagination.Prev>
                </>
                : ''
            ;
            const last = view['hydra:last']
                ? <Pagination.Last>
                    <Link to={"/user/contacts/list/" + view['hydra:last'].split('page=').pop()}>
                        Last
                    </Link>
                </Pagination.Last>
                : ''
            ;
            const curPage = view['@id'].split('page=').pop();
            const space = <span> </span>;
            const current = view['@id']
                ? <Pagination.Item active><span> {curPage} </span></Pagination.Item>
                : '';

            return (
                <div>
                    <Pagination>
                        {first}
                        {prev}
                        {current}
                        {next}
                        {last}
                    </Pagination>
                </div>
            );
        }
    }
    componentDidMount() {
        this.props.history.listen((location) => {
            let pathParts = location.pathname.split('/');
            const pageId = pathParts.pop();
            const lastPart = pathParts.pop();
            const preLastPart = pathParts.pop();
            if (preLastPart === 'contacts' && lastPart === 'list') {
                if (false === this.props.dataFetchFinished && false === this.props.loading) {
                    let user = null === this.props.user ? localStorage.getItem('user') : this.props.user;
                    this.props.fetchContactList(user, pageId);
                }
            }
        });
        if (false === this.props.dataFetchFinished && false === this.props.loading) {
            let user = null === this.props.user ? localStorage.getItem('user') : this.props.user;
            this.props.fetchContactList(user, this.props.match.params.id);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (Object.keys(this.props.deleted).length > 0) {
            let user = null === this.props.user ? localStorage.getItem('user') : this.props.user;
            this.props.fetchContactList(user, this.props.match.params.id);
            if (this.state.msg !== "Contact deleted succesfuly") {
                this.setState({msg: "Contact deleted succesfuly"});
            }
        }
    }

    render() {
        return (
            <div>
                <h1>Your Contacts</h1>
                <p>{this.state.msg}</p>
                {this.getContacts()}
                {this.getPager()}
            </div>
        );
    }
}

const connectedList = connect(mapStateToProps, mapDispatchToProps)(List);
export default withRouter(connectedList);
