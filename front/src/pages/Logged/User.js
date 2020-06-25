import React from "react";
import {connect} from "react-redux";
import {getUserData, initiateLogout} from "../../actions";
import {withRouter} from 'react-router';
import {Link, Route, Switch} from "react-router-dom";
import List from "./User/Notes/List";
import NotesCreateEdit from "./User/Notes/NotesCreateEdit";
import NotesShare from "./User/Notes/NotesShare";
import NotesSharedWithMe from "./User/Notes/NotesSharedWithMe";
import UserSettings from "./User/UserSettings";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const mapStateToProps = (state) => {
    return {...state};
};

const mapDispatchToProps = (dispatch) => {
    return {
        initiateLogout: () => dispatch(initiateLogout()),
        getUserData: (id) => dispatch(getUserData(id))
    };
};

class User extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        let user = localStorage.getItem('user');
        this.state = {
            user: user
        };
    }
    handleLogoutClick(event) {
        this.props.initiateLogout();
    }
    componentDidMount() {
        if (null !== this.state.user && null === this.props.user) {
            this.props.getUserData(this.state.user);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (null === this.props.user && true === this.props.loaded) {
            this.props.history.push('/');
        }
    }
    render() {

        if (this.props.userData === null) {
            this.props.getUserData(this.props.user);
        }
        const email = this.props.userData ? this.props.userData.email: '';
        const alert = this.props.alert ? <Alert variant="info">{this.props.alert}</Alert> : '';

        return (
            <div>
                {alert}
                <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                    <Navbar.Brand>Notes sharing</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/user/settings">Settings</Nav.Link>
                            <Nav.Link as={Link} to="/user/notes/list/1">Notes</Nav.Link>
                            <Nav.Link as={Link} to="/user/notes/create">Create Note</Nav.Link>
                            <Nav.Link as={Link} to="/user/notes/list/shared-with-me/1">Notes shared with me</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Brand className="navbar-right"><span style={{color: "grey"}}>User email:</span> {email}</Navbar.Brand>
                    <Button onClick={this.handleLogoutClick} variant="dark">Log out</Button>
                </Navbar>
                <Switch>
                    <Route path="/user/notes/list/:id(\d+)" component={List} />
                    <Route path="/user/notes/create" component={NotesCreateEdit} />
                    <Route path="/user/notes/edit/:id(\d+)" component={NotesCreateEdit} />
                    <Route path="/user/notes/share/:id(\d+)" component={NotesShare} />
                    <Route path="/user/notes/list/shared-with-me/:id(\d+)" component={NotesSharedWithMe} />
                    <Route path="/user/settings" component={UserSettings} />
                </Switch>
            </div>
        );
    }
}

const connectedUser = connect(mapStateToProps, mapDispatchToProps)(User);

export default withRouter(connectedUser);
