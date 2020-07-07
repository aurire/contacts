import {
    INITIATE_LOGIN_STARTED,
    INITIATE_LOGIN_FAILURE,
    INITIATE_LOGIN_SUCCESS,
    INITIATE_LOGOUT_STARTED,
    INITIATE_LOGOUT_FAILURE,
    INITIATE_LOGOUT_SUCCESS,
    GET_USER_DATA_SUCCESS,
    INITIATE_REGISTER_STARTED,
    INITIATE_REGISTER_SUCCESS,
    INITIATE_REGISTER_FAILURE,
    LOCATION_CHANGED, SET_ALERT,
    INITIATE_CONTACT_CREATE_STARTED,
    INITIATE_CONTACT_CREATE_FAILURE,
    INITIATE_CONTACT_CREATE_SUCCESS,
    FETCH_CONTACT_LIST_STARTED,
    FETCH_CONTACT_LIST_FAILURE,
    FETCH_CONTACT_LIST_SUCCESS,
    FETCH_CONTACT_SUCCESS,
    FETCH_CONTACT_STARTED,
    FETCH_CONTACT_FAILURE,
    INITIATE_CONTACT_EDIT_SUCCESS,
    INITIATE_CONTACT_EDIT_STARTED,
    INITIATE_CONTACT_EDIT_FAILURE,
    INITIATE_CONTACT_SHARE_SUCCESS,
    INITIATE_CONTACT_SHARE_STARTED,
    INITIATE_CONTACT_SHARE_FAILURE,
    FETCH_SHARED_FOR_USER_SUCCESS,
    FETCH_SHARED_FOR_USER_STARTED,
    FETCH_SHARED_FOR_USER_FAILURE,
    DELETE_SHARE_SUCCESS,
    DELETE_SHARE_STARTED,
    DELETE_SHARE_FAILURE,
    DELETE_CONTACT_SUCCESS,
    DELETE_CONTACT_STARTED,
    DELETE_CONTACT_FAILURE,
    INITIATE_USER_UPDATE_SUCCESS,
    INITIATE_USER_UPDATE_FAILURE,
    INITIATE_USER_UPDATE_STARTED,
    FETCH_BY_EMAIL_SUCCESS,
    FETCH_BY_EMAIL_STARTED,
    FETCH_BY_EMAIL_FAILURE
} from "../constants/actionTypes";

const initialState = {
    loading: false,
    loaded: false,
    dataFetchFinished: false,
    userFetchFinished: false,
    mainActionFinished: false,
    error: null,
    userData: null,
    user: null,
    alert: null,
    alertShown: true,
    contacts: {},
    contact: {},
    shared: {},
    deleted: {},
    search: {}
};

const rootReducer = (state = initialState, action) => {
    if (INITIATE_LOGIN_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false,
        };
    } else if (INITIATE_LOGIN_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            userFetchFinished: false,
            error: null,
            user: action.payload.payload.headers.location
        };
    } else if (INITIATE_LOGIN_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            userFetchFinished: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (GET_USER_DATA_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            userFetchFinished: true,
            userData: action.payload.payload.data,
            user: action.payload.payload.data['@id']
        };
    } else if (INITIATE_LOGOUT_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false,
        };
    } else if (INITIATE_LOGOUT_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            error: null,
            userData: null,
            user: null
        };
    } else if (INITIATE_LOGOUT_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (INITIATE_REGISTER_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false
        };
    } else if (INITIATE_REGISTER_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            error: null
        };
    } else if (INITIATE_REGISTER_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (LOCATION_CHANGED === action.type) {
        return state.alertShown
            ? {
                ...state,
                alert: null,
                loaded: false,
                deleted: {},
                search: {},
                dataFetchFinished: false,
                mainActionFinished: false,
                error: ''
            } : {
                ...state,
                alertShown: true,
                loaded: false,
                deleted: {},
                search: {},
                dataFetchFinished: false,
                mainActionFinished: false,
                error: ''
            };
    } else if (SET_ALERT === action.type) {
        return {
            ...state,
            alert: action.payload.msg,
            alertShown: false
        };
    } else if (INITIATE_CONTACT_CREATE_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false
        };
    } else if (INITIATE_CONTACT_CREATE_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            mainActionFinished: true,
            error: null,
            contacts: {}
        };
    } else if (INITIATE_CONTACT_CREATE_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (FETCH_CONTACT_LIST_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false
        };
    } else if (FETCH_CONTACT_LIST_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            error: null,
            deleted: {},
            contacts: {
                ...state.contacts,
                [action.payload.page]: action.payload.items.data
            }
        };
    } else if (FETCH_CONTACT_LIST_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (FETCH_CONTACT_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false,
        };
    } else if (FETCH_CONTACT_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            dataFetchFinished: true,
            error: null,
            contact: {
                ...state.contact,
                [action.payload.id]: action.payload.item.data
            }
        };
    } else if (FETCH_CONTACT_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            dataFetchFinished: true,
            error: action.payload.error
        };
    } else if (INITIATE_CONTACT_EDIT_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false
        };
    } else if (INITIATE_CONTACT_EDIT_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            mainActionFinished: true,
            contacts: {},
            error: null
        };
    } else if (INITIATE_CONTACT_EDIT_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (INITIATE_CONTACT_SHARE_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false
        };
    } else if (INITIATE_CONTACT_SHARE_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            mainActionFinished: true,
            error: null,
            contacts: {}
        };
    } else if (INITIATE_CONTACT_SHARE_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (FETCH_SHARED_FOR_USER_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false,
        };
    } else if (FETCH_SHARED_FOR_USER_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            dataFetchFinished: true,
            error: null,
            shared: {
                ...state.shared,
                [action.payload.page]: action.payload.item.data
            }
        };
    } else if (FETCH_SHARED_FOR_USER_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            dataFetchFinished: true,
            error: action.payload.error
        };
    } else if (DELETE_SHARE_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false
        };
    } else if (DELETE_SHARE_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            error: null,
            contacts: {},
            deleted: {
                ...state.deleted,
                [action.payload.id]: true
            }
        };
    } else if (DELETE_SHARE_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (DELETE_CONTACT_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false
        };
    } else if (DELETE_CONTACT_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            error: null,
            deleted: {
                ...state.deleted,
                [action.payload.id]: true
            }
        };
    } else if (DELETE_CONTACT_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (INITIATE_USER_UPDATE_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false
        };
    } else if (INITIATE_USER_UPDATE_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            mainActionFinished: true,
            userFetchFinished: true,
            userData: action.payload.payload.data,
            user: action.payload.payload.data['@id'],
            contacts: {},
            error: null
        };
    } else if (INITIATE_USER_UPDATE_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            error: action.payload.error
        };
    } else if (FETCH_BY_EMAIL_STARTED === action.type) {
        return {
            ...state,
            loading: true,
            loaded: false,
        };
    } else if (FETCH_BY_EMAIL_SUCCESS === action.type) {
        return {
            ...state,
            loading: false,
            loaded: true,
            dataFetchFinished: true,
            error: null,
            search: {
                ...state.search,
                [action.payload.email]: {
                    ...state.search[[action.payload.email]],
                    [action.payload.page]: action.payload.item.data
                }
            }
        };
    } else if (FETCH_BY_EMAIL_FAILURE === action.type) {
        return {
            ...state,
            loading: false,
            loaded: false,
            dataFetchFinished: true,
            error: action.payload.error
        };
    }

    return state;
}

export default rootReducer;
