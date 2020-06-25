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
    INITIATE_CONTACT_CREATE_STARTED,
    INITIATE_CONTACT_CREATE_FAILURE,
    INITIATE_CONTACT_CREATE_SUCCESS,
    FETCH_CONTACT_LIST_STARTED,
    FETCH_CONTACT_LIST_FAILURE,
    FETCH_CONTACT_LIST_SUCCESS,
    FETCH_CONTACT_FAILURE,
    FETCH_CONTACT_STARTED,
    FETCH_CONTACT_SUCCESS,
    INITIATE_CONTACT_EDIT_FAILURE,
    INITIATE_CONTACT_EDIT_STARTED,
    INITIATE_CONTACT_EDIT_SUCCESS,
    INITIATE_CONTACT_SHARE_FAILURE,
    INITIATE_CONTACT_SHARE_STARTED,
    INITIATE_CONTACT_SHARE_SUCCESS,
    FETCH_SHARED_FOR_USER_FAILURE,
    FETCH_SHARED_FOR_USER_STARTED,
    FETCH_SHARED_FOR_USER_SUCCESS,
    DELETE_SHARE_FAILURE,
    DELETE_SHARE_STARTED,
    DELETE_SHARE_SUCCESS,
    DELETE_CONTACT_FAILURE,
    DELETE_CONTACT_STARTED,
    DELETE_CONTACT_SUCCESS,
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

//initiateContactCreate
export const initiateContactCreate = (ownerId, name, phone) => {
    return dispatch => {
        dispatch(initiateContactCreateStarted());

        axios
            .post(HOST + "api/contacts", {
                "name": name,
                "phone": phone,
                "isPublic": true,
                "owner": "/api/users/" + ownerId
            }, {withCredentials: true})
            .then(res => {
                dispatch(initiateContactCreateSuccess(res));
            })
            .catch(err => {
                dispatch(initiateContactCreateFailed(err));
            });
    };
};
const initiateContactCreateStarted = () => {
    return {
        type: INITIATE_CONTACT_CREATE_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateContactCreateSuccess = payload => {
    return {
        type: INITIATE_CONTACT_CREATE_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateContactCreateFailed = error => {
    return {
        type: INITIATE_CONTACT_CREATE_FAILURE,
        payload: {
            error
        }
    };
};

//fetchContactList
export const fetchContactList = (owner, page) => {
    return dispatch => {
        dispatch(fetchContactListStarted());

        axios
            .get(HOST + "api/contacts?owner=" + owner
                + "&page=" + page, {withCredentials: true})
            .then(res => {
                dispatch(fetchContactListSuccess(res, page));
            })
            .catch(err => {
                dispatch(fetchContactListFailed(err));
            });
    };
};
const fetchContactListStarted = () => {
    return {
        type: FETCH_CONTACT_LIST_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const fetchContactListSuccess = (payload, page) => {
    return {
        type: FETCH_CONTACT_LIST_SUCCESS,
        payload: {
            items: payload,
            page: page
        }
    };
};
const fetchContactListFailed = error => {
    return {
        type: FETCH_CONTACT_LIST_FAILURE,
        payload: {
            error
        }
    };
};

//fetchContact
export const fetchContact = (id) => {
    return dispatch => {
        dispatch(fetchContactStarted());

        axios
            .get(HOST + "api/contacts/" + id, {withCredentials: true})
            .then(res => {
                dispatch(fetchContactSuccess(res, id));
            })
            .catch(err => {
                dispatch(fetchContactFailed(err));
            });
    };
};
const fetchContactStarted = () => {
    return {
        type: FETCH_CONTACT_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const fetchContactSuccess = (payload, id) => {
    return {
        type: FETCH_CONTACT_SUCCESS,
        payload: {
            item: payload,
            id: id
        }
    };
};
const fetchContactFailed = error => {
    return {
        type: FETCH_CONTACT_FAILURE,
        payload: {
            error
        }
    };
};

//initiateContactEdit
export const initiateContactEdit = (ownerId, id, name, phone) => {
    return dispatch => {
        dispatch(initiateContactEditStarted());

        axios
            .put(HOST + "api/contacts/" + id, {
                "name": name,
                "phone": phone,
                "isPublic": true,
                "owner": "/api/users/" + ownerId
            }, {withCredentials: true})
            .then(res => {
                dispatch(initiateContactEditSuccess(res));
            })
            .catch(err => {
                dispatch(initiateContactEditFailed(err));
            });
    };
};
const initiateContactEditStarted = () => {
    return {
        type: INITIATE_CONTACT_EDIT_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateContactEditSuccess = payload => {
    return {
        type: INITIATE_CONTACT_EDIT_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateContactEditFailed = error => {
    return {
        type: INITIATE_CONTACT_EDIT_FAILURE,
        payload: {
            error
        }
    };
};

//initiateContactShare
export const initiateContactShare = (contact, user) => {
    return dispatch => {
        dispatch(initiateContactShareStarted());

        axios
            .post(HOST + "api/share_contact_to_users", {
                "contact": contact,
                "user": user
            }, {withCredentials: true})
            .then(res => {
                dispatch(initiateContactShareSuccess(res));
            })
            .catch(err => {
                dispatch(initiateContactShareFailed(err));
            });
    };
};
const initiateContactShareStarted = () => {
    return {
        type: INITIATE_CONTACT_SHARE_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const initiateContactShareSuccess = payload => {
    return {
        type: INITIATE_CONTACT_SHARE_SUCCESS,
        payload: {
            payload
        }
    };
};
const initiateContactShareFailed = error => {
    return {
        type: INITIATE_CONTACT_SHARE_FAILURE,
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
                HOST + "api/share_contact_to_users?user=" + id + "&page=" + page,
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
                HOST + "api/share_contact_to_users/" + id,
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

//deleteContact
export const deleteContact = (id) => {
    return dispatch => {
        dispatch(deleteContactStarted());

        axios
            .delete(
                HOST + "api/contacts/" + id,
                {withCredentials: true}
            )
            .then(res => {
                dispatch(deleteContactSuccess(id));
            })
            .catch(err => {
                dispatch(deleteContactFailed(err));
            });
    };
};
const deleteContactStarted = () => {
    return {
        type: DELETE_CONTACT_STARTED,
        payload: {
            isLoading: true
        }
    };
};
const deleteContactSuccess = (id) => {
    return {
        type: DELETE_CONTACT_SUCCESS,
        payload: {
            id: id
        }
    };
};
const deleteContactFailed = error => {
    return {
        type: DELETE_CONTACT_FAILURE,
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
