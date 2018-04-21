import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Routes from "./Routes";
import NavBar from "./containers/NavBar";
import { Auth } from "aws-amplify";
import "./App.css";


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // AWS Authentification:
      isAuthenticated: false,
      isAuthenticating: true
    };

    //QB Authentification:
    // realmId: '',
    // accessToken: '',
    // payload: '',
    // scope: '',
    // oauth2_token_json: {
    // x_refresh_token_expires_in: 0,
    // refresh_token: "",
    // access_token: "",
    // token_type: "",
    // expires_in: 0
    // },
    // authUri: '',
    // redirectUri: '',
    // token: '',
    // companyInfo: ''


  }

  async componentDidMount() {
    try {
      if (await Auth.currentSession()) {
        this.userHasAuthenticated(true);
      }
    }
    catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });

  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setQBrealmId = realmId => {
    this.setState({ realmId: realmId });
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,

      realmId: this.state.realmId,
      setQBrealmId: this.setQBrealmId,
      accessToken: this.state.accessToken,
      payload: this.state.payload,
      scope: this.state.scope,
      oauth2_token_json: this.state.oauth2_token_json,
      authUri: this.state.authUri,
      redirectUri: this.state.redirectUri,
      token: this.state.token,
    }

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <NavBar childProps={childProps} />
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);