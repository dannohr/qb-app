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
      isAuthenticated: false,
      isAuthenticating: true
    };
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

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <NavBar authStatus={childProps} userHasAuthenticated={this.userHasAuthenticated} />
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);