import React, { Component } from "react";
import queryString from 'query-string';
import config from "../config";
import { API } from "aws-amplify";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as qbActions from '../actions/qbActions';
import "./QuickBooks.css";

class QuickBooks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            realmId: '',
            accessToken: '',
            payload: '',
            scope: '',
            oauth2_token_json: {
                x_refresh_token_expires_in: 0,
                refresh_token: "",
                access_token: "",
                token_type: "",
                expires_in: 0
            },
            // authUri: '',
            redirectUri: '',
            token: '',
            companyInfo: ''

        };
    }

    // getAuthUri = async () => {
    //     // this.props.userHasAuthenticated(false);
    //     try {
    //         // built Uri and add to state
    //         const authUri = await API.get("notes", "/qburi")
    //         this.setState({ authUri });
    //         return authUri
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    getCallback = async () => {

        var parsedUri = queryString.parse(this.state.redirectUri);

        this.setState({ realmId: parsedUri.realmId });

        var auth = (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'));
        var postBody = {
            url: config.token_endpoint,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + auth
            },
            form: {
                grant_type: 'authorization_code',
                code: parsedUri.code,
                redirect_uri: config.redirectUri
            }
        };

        const tokenJSON = await API.post("notes", "/token", {
            body: postBody
        });

        let oauth2_token_json = JSON.parse(tokenJSON)

        this.setState({ oauth2_token_json });
    }


    getRedirectUri = (auth) => {
        // Launch Popup using the JS window Object
        console.log(auth)
        var parameters = "location=1,width=600,height=800";
        var win = window.open(auth, 'connectPopup', parameters);
        console.log('opening window')

        var pollOAuth = window.setInterval(() => {
            try {

                if (win.document.URL.indexOf("code") !== -1) {
                    window.clearInterval(pollOAuth);
                    const redirectUri = win.document.URL;
                    this.setState({ redirectUri })
                    win.close();
                    this.getCallback()
                }
            } catch (e) {
                // console.log(e)
            }

        }, 100)
    }


    handleLogin = async () => {
        console.log(this.props)
        this.getRedirectUri(this.props.qbAuth.authUri)
    }

    handleRefresh = () => {
        this.getRedirectUri(this.props.qbActions.getUri())
        // this.props.qbActions.getUri()
        console.log(this.props)
    }

    handleGetCompanyInfo = async () => {
        try {
            // built Uri and add to state
            const companyInfo = await API.get("notes", "/getcompinfo" +
                "?a=" + config.clientId +
                "&b=" + config.clientSecret +
                "&c=" + this.state.oauth2_token_json.access_token +
                "&d=" + this.state.realmId +
                "&e=" + config.useSandbox +
                "&f=" + this.state.oauth2_token_json.refresh_token)
            this.setState({ companyInfo: JSON.parse(companyInfo) });
            console.log(companyInfo)

        } catch (err) {
            console.log(err)
        }
    }

    componentWillMount() { // HERE WE ARE TRIGGERING THE ACTION
        this.props.qbActions.getUri();
    }

    componentDidMount() {

        // console.log(this.state)
        // console.log(this.props)

    }

    render() {

        return (
            <div className="container">

                <div className="well text-center">
                    <h1>Establish Connection</h1>
                </div>

                <h2>OAuth2.0</h2><h4>(Please refer to the <a target="_balnk" href="https://developer.intuit.com/docs/00_quickbooks_online/2_build/10_authentication_and_authorization/10_oauth_2.0">OAuth2.0 Documentation</a> )</h4>
                <p>If there is no access token or the access token is invalid, click the <b>Connect to QuickBooks</b> button below.</p>

                <img src="./assets/C2QB_green_btn_lg_default.png" width="178" alt="login button" onClick={this.handleLogin.bind(this)} />
                <button type="button" id="refreshToken" className="btn btn-success" onClick={this.handleRefresh}>Refresh Token</button>
                <hr />
                <button type="button" className="btn btn-success" onClick={this.handleGetCompanyInfo}>Get Company Info</button>
                <button type="button" className="btn btn-success" onClick={this.handleTestCall}>Testing API</button>
                <hr />

                <pre> {JSON.stringify(this.state.oauth2_token_json, null, 2)} </pre>
                <pre> {JSON.stringify(this.props.qbAuth.authUri, null, 2)} </pre>
                <pre> {JSON.stringify(this.state.redirectUri, null, 2)} </pre>
                <pre> {JSON.stringify(this.state.companyInfo, null, 2)} </pre>

            </div>
        );
    }
}



function mapStateToProps(state) {
    return {
        // This is what it's called in this.props
        qbAuth: state.qbReducer.qbAuth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        qbActions: bindActionCreators(qbActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuickBooks);