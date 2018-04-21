import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import AppliedRoute from "./components/AppliedRoute";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import UserNotes from "./containers/UserNotes";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import QuickBooks from "./containers/QuickBooks";
import TenantList from "./containers/TenantList";

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
        <AppliedRoute path="/usernotes" exact component={UserNotes} props={childProps} />
        <AuthenticatedRoute path="/notes/new" exact component={NewNote} props={childProps} />
        <AuthenticatedRoute path="/notes/:id" exact component={Notes} props={childProps} />
        <AuthenticatedRoute path="/quickbooks" exact component={QuickBooks} props={childProps} />
        <AuthenticatedRoute path="/tenant" exact component={TenantList} props={childProps} />
        {/* <AuthenticatedRoute path="/companyinfo" exact component={Com} props={childProps} /> */}
        { /* Finally, catch all unmatched routes */}
        <Route component={NotFound} />
    </Switch>;