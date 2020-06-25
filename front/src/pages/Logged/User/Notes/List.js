import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {Link} from "react-router-dom";
import {fetchNotesList, setAlert, deleteNote} from "../../../../actions";
import ListGroup from "react-bootstrap/ListGroup";
import Pagination from "react-bootstrap/Pagination";

const mapDispatchToProps = (dispatch) => {
    return {
        fetchNotesList: (owner, page) => dispatch(fetchNotesList(owner, page)),
        deleteNote: (id) => dispatch(deleteNote(id)),
        setAlert: (msg) => dispatch(setAlert(msg))
    };
};

const mapStateToProps = (state) => {
    return {...state};
};

//http://localhost/api/notes?page=1
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
        this.props.deleteNote(event.target.dataset.id.split('/').pop());
    }
    getNotes() {
        if (this.props.notes[this.props.match.params.id]) {
            let notes = this.props.notes[this.props.match.params.id]['hydra:member'];

            const listItems = notes.map((note) =>
              <ListGroup.Item key={note['@id']}>
                  <h5>{note['title']} <span style={{fontWeight: "normal", fontSize: "small"}}>{
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
                      ).format(new Date(note['createdAt']))
                  }</span></h5>
                  <p>{note['shortMessage']}</p>
                  <Link to={"/user/notes/edit/" + note['@id'].split('/').pop()}>Edit Note</Link>
                  <span> | </span>
                  <Link to={"/user/notes/share/" + note['@id'].split('/').pop()}>Share Note</Link>
                  <span> | </span>
                  <a href="#" data-id={note['@id'].split('/').pop()} onClick={this.onDeleteClick} >Delete Note</a>
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
        if (this.props.notes[this.props.match.params.id]) {
            let view = this.props.notes[this.props.match.params.id]['hydra:view'];
            if (false === view['@id'].includes('page=')) {
                return '';
            }
            const first = view['hydra:first']
                ? <Pagination.First>
                    <Link to={"/user/notes/list/" + view['hydra:first'].split('page=').pop()}>
                        First
                    </Link>
                </Pagination.First>
                : ''
            ;

            const next = view['hydra:next']
                ? <>
                    <Pagination.Next>
                        <Link to={"/user/notes/list/"
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
                        <Link to={"/user/notes/list/"
                            + view['hydra:previous'].split('page=').pop()}>
                            Previous
                        </Link>
                    </Pagination.Prev>
                </>
                : ''
            ;
            const last = view['hydra:last']
                ? <Pagination.Last>
                    <Link to={"/user/notes/list/" + view['hydra:last'].split('page=').pop()}>
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
            if (preLastPart === 'notes' && lastPart === 'list') {
                if (false === this.props.dataFetchFinished && false === this.props.loading) {
                    let user = null === this.props.user ? localStorage.getItem('user') : this.props.user;
                    this.props.fetchNotesList(user, pageId);
                }
            }
        });
        if (false === this.props.dataFetchFinished && false === this.props.loading) {
            let user = null === this.props.user ? localStorage.getItem('user') : this.props.user;
            this.props.fetchNotesList(user, this.props.match.params.id);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (Object.keys(this.props.deleted).length > 0) {
            let user = null === this.props.user ? localStorage.getItem('user') : this.props.user;
            this.props.fetchNotesList(user, this.props.match.params.id);
            if (this.state.msg !== "Note deleted succesfuly") {
                this.setState({msg: "Note deleted succesfuly"});
            }
        }
    }

    render() {
        return (
            <div>
                <h1>Your notes</h1>
                <p>{this.state.msg}</p>
                {this.getNotes()}
                {this.getPager()}
            </div>
        );
    }
}

const connectedList = connect(mapStateToProps, mapDispatchToProps)(List);
export default withRouter(connectedList);
