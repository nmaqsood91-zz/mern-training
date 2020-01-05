import {REGISTERING_USER, USER_REGISTERD, ERROR_REGISTERING_USER} from '../types'
import { act } from 'react-dom/test-utils'

const initialState = {
    user: null,
    errors: null,
    loading: false
}

export default function (state = initialState, action) {
    console.log('action', action.type, action.payload)
    switch(action.type) {
        case REGISTERING_USER:
            return {...state, loading: true}
        case USER_REGISTERD:
            return {...state, user: action.payload, loading: false}
        case ERROR_REGISTERING_USER:
            return {...state, errors: action.payload, loading: false}
        default:
            return state
    }
}