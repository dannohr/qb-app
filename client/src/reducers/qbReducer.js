import initialState from './initialState';
import { GET_QB_URI, GET_COMPANY_INFO } from '../actions/actionTypes';

export default function (state = initialState, action) {

    switch (action.type) {

        case GET_QB_URI:
            // console.log('GET_QB_URI Action Payload:')
            // console.log(action.payload)

            //https://stackoverflow.com/questions/43376849/use-object-assign-or-spread-operator-in-react-redux-which-is-a-better-practise
            return {
                ...state,
                qbAuth: {
                    ...state.qbAuth,
                    authUri: action.payload
                }
            }

        case GET_COMPANY_INFO:
            console.log('GET_COMPANY_INFO Action Payload:')
            console.log(action.payload)

            return {
                ...state,
                companyInfo: {
                    ...state.companyInfo,
                    info: action.payload
                }
            }


        default:
            return state;
    }
}

//https://hackernoon.com/a-basic-react-redux-introductory-tutorial-adcc681eeb5e