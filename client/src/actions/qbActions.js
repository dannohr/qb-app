import { API } from "aws-amplify";
import config from "../config";
// import * as types from './actionTypes';


export function getUri() {
    console.log('In the action')
    return (dispatch, getState) => {
        dispatch({ type: "REQUEST_STARTED" });

        API.get("notes", "/qburi")
            .then(

                response => dispatch({ type: "GET_QB_URI", payload: response }),
                error => dispatch({ type: "REQUEST_FAILED", error: error })
            );
    }
}

export function getCompanyInfo() {
    return (dispatch, getState) => {
        dispatch({ type: "REQUEST_STARTED" });

        API.get("notes", "/getcompinfo" +
            "?a=" + config.clientId +
            "&b=" + config.clientSecret +
            "&c=" + this.state.oauth2_token_json.access_token +
            "&d=" + this.state.realmId +
            "&e=" + config.useSandbox +
            "&f=" + this.state.oauth2_token_json.refresh_token)

            .then(

                response => dispatch({ type: "GET_QB_URI", payload: response }),
                error => dispatch({ type: "REQUEST_FAILED", error: error })
            );





    }
}