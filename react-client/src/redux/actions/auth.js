import axios from 'axios'
import {REGISTERING_USER, USER_REGISTERD, ERROR_REGISTERING_USER} from '../types'
export function register(user) {
    const url = "https://merntrain.herokuapp.com/api/v1/auth"
    return (async dispatch => {
        try {
            dispatch({
                type: REGISTERING_USER,
                payload: null
            })
            const _user = await axios.post(url, user)
            dispatch({
                type: USER_REGISTERD,
                payload: _user.data
            })
        } catch (err) {
            dispatch({
                type: ERROR_REGISTERING_USER,
                payload: err.message
            })
        }
    })
}