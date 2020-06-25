import {
    INITIATE_LOGIN_STARTED,
    INITIATE_LOGIN_SUCCESS,
    INITIATE_LOGIN_FAILURE,
    INITIATE_LOGOUT_STARTED,
    INITIATE_LOGOUT_FAILURE,
    INITIATE_LOGOUT_SUCCESS,
    GET_USER_DATA_SUCCESS,
    INITIATE_REGISTER_STARTED,
    INITIATE_REGISTER_SUCCESS,
    INITIATE_REGISTER_FAILURE,
    LOCATION_CHANGED,
    SET_ALERT,
    INITIATE_NOTE_CREATE_STARTED,
    INITIATE_NOTE_CREATE_FAILURE,
    INITIATE_NOTE_CREATE_SUCCESS,
    FETCH_NOTE_LIST_STARTED,
    FETCH_NOTE_LIST_FAILURE,
    FETCH_NOTE_LIST_SUCCESS,
    FETCH_NOTE_FAILURE,
    FETCH_NOTE_STARTED,
    FETCH_NOTE_SUCCESS,
    INITIATE_NOTE_EDIT_FAILURE,
    INITIATE_NOTE_EDIT_STARTED,
    INITIATE_NOTE_EDIT_SUCCESS,
    INITIATE_NOTE_SHARE_FAILURE,
    INITIATE_NOTE_SHARE_STARTED,
    INITIATE_NOTE_SHARE_SUCCESS,
    FETCH_SHARED_FOR_USER_FAILURE,
    FETCH_SHARED_FOR_USER_STARTED,
    FETCH_SHARED_FOR_USER_SUCCESS,
    DELETE_SHARE_FAILURE,
    DELETE_SHARE_STARTED,
    DELETE_SHARE_SUCCESS,
    DELETE_NOTE_FAILURE,
    DELETE_NOTE_STARTED,
    DELETE_NOTE_SUCCESS,
    INITIATE_USER_UPDATE_STARTED,
    INITIATE_USER_UPDATE_FAILURE,
    INITIATE_USER_UPDATE_SUCCESS,
    FETCH_BY_EMAIL_FAILURE,
    FETCH_BY_EMAIL_STARTED,
    FETCH_BY_EMAIL_SUCCESS
} from "../constants/actionTypes";
import axios from "axios";

const HOST = 'http://localhost/';

//getUserData
export const getUserData = (id) => {
    return dispatch => {
        //dispatch(getUserDataStarted());
        if (id !== null) {
            let userId = id.split('/');
            axios
                .get(HOST + "api/users/" + userId.pop(), {withCredentials: true})
                .then(res => {
                    dispatch(getUserDataSuccess(res));
                })
                .catch(err => {
                    //dispatch(getUserDataFailed(err.message));
                });
        }
    };
};
export const getUserDataSuccess = payload => {
    return {
        type: GET_USER_DATA_SUCCESS,
        payload: {
            payload
        }
    };
};

//initiateLogin
export const initiateLogin = (email, password) => {
    return dispatch => {
        dispatch(initiateLoginStarted());

        axios
            .post(HOST + "login", {
                "email": email,
                "password": password
            })
            .then(res => {
                if (res.headers.location) {
                    localStorage.setItem('user', res.headers.location);
                }
                dispatch(getUserData(res.headers.location));
                dispatch(initiateLoginSuccess(res));
            })
            .catch(err => {
                dispatch(initiateLoginFailed(err));
            });
    };
};
const initiateLoginStarted = () => {
    return {
        type: INITIATE_LOGIN_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateLoginSuccess = payload => {
    return {
        type: INITIATE_LOGIN_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateLoginFailed = error => {
    return {
        type: INITIATE_LOGIN_FAILURE,
        payload: {
            error
        }
    };
};

//initiateLogout
export const initiateLogout = () => {
    return dispatch => {
        dispatch(initiateLogoutStarted());
        axios
            .post(HOST + "logout")
            .then(res => {
                localStorage.removeItem('user');
                dispatch(initiateLogoutSuccess(res));
            })
            .catch(err => {
                dispatch(initiateLogoutFailed(err.message));
            });
    };
};
const initiateLogoutStarted = () => {
    return {
        type: INITIATE_LOGOUT_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateLogoutSuccess = payload => {
    return {
        type: INITIATE_LOGOUT_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateLogoutFailed = error => {
    return {
        type: INITIATE_LOGOUT_FAILURE,
        payload: {
            error
        }
    };
};

//initiateRegister
export const initiateRegister = (email, password) => {
    return dispatch => {
        dispatch(initiateRegisterStarted());

        axios
            .post(HOST + "api/users", {
                "email": email,
                "password": password
            }, {withCredentials: true})
            .then(res => {
                dispatch(initiateRegisterSuccess(res));
            })
            .catch(err => {
                dispatch(initiateRegisterFailed(err));
            });
    };
};
const initiateRegisterStarted = () => {
    return {
        type: INITIATE_REGISTER_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateRegisterSuccess = payload => {
    return {
        type: INITIATE_REGISTER_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateRegisterFailed = error => {
    return {
        type: INITIATE_REGISTER_FAILURE,
        payload: {
            error
        }
    };
};

export const locationChanged = () => {
    return {
        type: LOCATION_CHANGED,
        payload: {}
    };
};
export const setAlert = (msg) => {
    return {
        type: SET_ALERT,
        payload: {msg: msg}
    };
};

//initiateNoteCreate
export const initiateNoteCreate = (ownerId, title, message) => {
    return dispatch => {
        dispatch(initiateNoteCreateStarted());

        axios
            .post(HOST + "api/notes", {
                "title": title,
                "message": message,
                "isPublic": true,
                "owner": "/api/users/" + ownerId
            }, {withCredentials: true})
            .then(res => {
                dispatch(initiateNoteCreateSuccess(res));
            })
            .catch(err => {
                dispatch(initiateNoteCreateFailed(err));
            });
    };
};
const initiateNoteCreateStarted = () => {
    return {
        type: INITIATE_NOTE_CREATE_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateNoteCreateSuccess = payload => {
    return {
        type: INITIATE_NOTE_CREATE_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateNoteCreateFailed = error => {
    return {
        type: INITIATE_NOTE_CREATE_FAILURE,
        payload: {
            error
        }
    };
};

//fetchNotesList
export const fetchNotesList = (owner, page) => {
    return dispatch => {
        dispatch(fetchNoteListStarted());

        axios
            .get(HOST + "api/notes?owner=" + owner
                + "&page=" + page, {withCredentials: true})
            .then(res => {
                dispatch(fetchNoteListSuccess(res, page));
            })
            .catch(err => {
                dispatch(fetchNoteListFailed(err));
            });
    };
};
const fetchNoteListStarted = () => {
    return {
        type: FETCH_NOTE_LIST_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const fetchNoteListSuccess = (payload, page) => {
    return {
        type: FETCH_NOTE_LIST_SUCCESS,
        payload: {
            items: payload,
            page: page
        }
    };
};
const fetchNoteListFailed = error => {
    return {
        type: FETCH_NOTE_LIST_FAILURE,
        payload: {
            error
        }
    };
};

//fetchNote
export const fetchNote = (id) => {
    return dispatch => {
        dispatch(fetchNoteStarted());

        axios
            .get(HOST + "api/notes/" + id, {withCredentials: true})
            .then(res => {
                dispatch(fetchNoteSuccess(res, id));
            })
            .catch(err => {
                dispatch(fetchNoteFailed(err));
            });
    };
};
const fetchNoteStarted = () => {
    return {
        type: FETCH_NOTE_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const fetchNoteSuccess = (payload, id) => {
    return {
        type: FETCH_NOTE_SUCCESS,
        payload: {
            item: payload,
            id: id
        }
    };
};
const fetchNoteFailed = error => {
    return {
        type: FETCH_NOTE_FAILURE,
        payload: {
            error
        }
    };
};

//initiateNoteEdit
export const initiateNoteEdit = (ownerId, id, title, message) => {
    return dispatch => {
        dispatch(initiateNoteEditStarted());

        axios
            .put(HOST + "api/notes/" + id, {
                "title": title,
                "message": message,
                "isPublic": true,
                "owner": "/api/users/" + ownerId
            }, {withCredentials: true})
            .then(res => {
                dispatch(initiateNoteEditSuccess(res));
            })
            .catch(err => {
                dispatch(initiateNoteEditFailed(err));
            });
    };
};
const initiateNoteEditStarted = () => {
    return {
        type: INITIATE_NOTE_EDIT_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateNoteEditSuccess = payload => {
    return {
        type: INITIATE_NOTE_EDIT_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateNoteEditFailed = error => {
    return {
        type: INITIATE_NOTE_EDIT_FAILURE,
        payload: {
            error
        }
    };
};

//initiateNoteShare
export const initiateNoteShare = (note, user) => {
    return dispatch => {
        dispatch(initiateNoteShareStarted());

        axios
            .post(HOST + "api/share_note_to_users", {
                "note": note,
                "user": user
            }, {withCredentials: true})
            .then(res => {
                dispatch(initiateNoteShareSuccess(res));
            })
            .catch(err => {
                dispatch(initiateNoteShareFailed(err));
            });
    };
};
const initiateNoteShareStarted = () => {
    return {
        type: INITIATE_NOTE_SHARE_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateNoteShareSuccess = payload => {
    return {
        type: INITIATE_NOTE_SHARE_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateNoteShareFailed = error => {
    return {
        type: INITIATE_NOTE_SHARE_FAILURE,
        payload: {
            error
        }
    };
};

//fetchSharedForUser
export const fetchSharedForUser = (id, page) => {
    return dispatch => {
        dispatch(fetchSharedForUserStarted());

        axios
            .get(
                HOST + "api/share_note_to_users?user=" + id + "&page=" + page,
                {withCredentials: true}
                )
            .then(res => {
                dispatch(fetchSharedForUserSuccess(res, page));
            })
            .catch(err => {
                dispatch(fetchSharedForUserFailed(err));
            });
    };
};
const fetchSharedForUserStarted = () => {
    return {
        type: FETCH_SHARED_FOR_USER_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const fetchSharedForUserSuccess = (payload, page) => {
    return {
        type: FETCH_SHARED_FOR_USER_SUCCESS,
        payload: {
            item: payload,
            page: page
        }
    };
};
const fetchSharedForUserFailed = error => {
    return {
        type: FETCH_SHARED_FOR_USER_FAILURE,
        payload: {
            error
        }
    };
};

//deleteShare
export const deleteShare = (id) => {
    return dispatch => {
        dispatch(deleteShareStarted());

        axios
            .delete(
                HOST + "api/share_note_to_users/" + id,
                {withCredentials: true}
            )
            .then(res => {
                dispatch(deleteShareSuccess(id));
            })
            .catch(err => {
                dispatch(deleteShareFailed(err));
            });
    };
};
const deleteShareStarted = () => {
    return {
        type: DELETE_SHARE_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const deleteShareSuccess = (id) => {
    return {
        type: DELETE_SHARE_SUCCESS,
        payload: {
            id: id
        }
    };
};
const deleteShareFailed = error => {
    return {
        type: DELETE_SHARE_FAILURE,
        payload: {
            error
        }
    };
};

//deleteNote
export const deleteNote = (id) => {
    return dispatch => {
        dispatch(deleteNoteStarted());

        axios
            .delete(
                HOST + "api/notes/" + id,
                {withCredentials: true}
            )
            .then(res => {
                dispatch(deleteNoteSuccess(id));
            })
            .catch(err => {
                dispatch(deleteNoteFailed(err));
            });
    };
};
const deleteNoteStarted = () => {
    return {
        type: DELETE_NOTE_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const deleteNoteSuccess = (id) => {
    return {
        type: DELETE_NOTE_SUCCESS,
        payload: {
            id: id
        }
    };
};
const deleteNoteFailed = error => {
    return {
        type: DELETE_NOTE_FAILURE,
        payload: {
            error
        }
    };
};

//initiateUserUpdate
export const initiateUserUpdate = (id, phone) => {
    return dispatch => {
        dispatch(initiateUserUpdateStarted());

        axios
            .put(HOST + "api/users/" + id, {
                "phoneNumber": phone
            }, {withCredentials: true})
            .then(res => {
                dispatch(initiateUserUpdateSuccess(res));
            })
            .catch(err => {
                dispatch(initiateUserUpdateFailed(err));
            });
    };
};
const initiateUserUpdateStarted = () => {
    return {
        type: INITIATE_USER_UPDATE_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateUserUpdateSuccess = payload => {
    return {
        type: INITIATE_USER_UPDATE_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateUserUpdateFailed = error => {
    return {
        type: INITIATE_USER_UPDATE_FAILURE,
        payload: {
            error
        }
    };
};

//fetchByEmail
export const fetchByEmail = (email, page) => {
    return dispatch => {
        dispatch(fetchByEmailStarted());

        axios
            .get(
                HOST + "api/users?properties%5B%5D=email&properties%5B%5D=id&email="
                + encodeURIComponent(email) + "&page=" + page,
                {withCredentials: true}
            )
            .then(res => {
                dispatch(fetchByEmailSuccess(res, email, page));
            })
            .catch(err => {
                dispatch(fetchByEmailFailed(err));
            });
    };
};
const fetchByEmailStarted = () => {
    return {
        type: FETCH_BY_EMAIL_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const fetchByEmailSuccess = (payload, email, page) => {
    return {
        type: FETCH_BY_EMAIL_SUCCESS,
        payload: {
            item: payload,
            email: email,
            page: page
        }
    };
};
const fetchByEmailFailed = error => {
    return {
        type: FETCH_BY_EMAIL_FAILURE,
        payload: {
            error
        }
    };
};
