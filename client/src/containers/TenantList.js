import React, { Component } from "react";
// import queryString from 'query-string';
// import config from "../config";
// import { API } from "aws-amplify";
import { PageHeader } from "react-bootstrap";
import "./QuickBooks.css";

export default class TenantList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            test1: ''
        };
    }

    render() {

        return (
            <div className="some class">
                <PageHeader>Tenant List</PageHeader>
                <p> Here are the customers </p>
            </div>
        );
    }
}