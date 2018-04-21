import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { API } from "aws-amplify";
import { PageHeader } from "react-bootstrap";
// import QuickBooks from "../containers/QuickBooks";
import "./Home.css";


export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            notes: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            //const notes = await this.notes();
            //this.setState({ notes });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p>A simple note taking app</p>
                <div>
                    <Link to="/login" className="btn btn-info btn-lg">
                        Login
        </Link>
                    <Link to="/signup" className="btn btn-success btn-lg">
                        Signup
        </Link>
                </div>
            </div>
        );
    }

    renderHomePage() {
        return (
            <div className="notes">
                <PageHeader>Home Page</PageHeader>
                {/* <QuickBooks /> */}

            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderHomePage() : this.renderLander()}

            </div>
        );
    }
}