import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Auth } from "aws-amplify";
import "./NavBar.css";

export default class NavBar extends Component {

    handleLogout = async event => {
        await Auth.signOut();
        this.props.userHasAuthenticated(false);
    }

    render() {

        return (
            <Navbar fluid collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Quickbooks Rental App</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        {this.props.authStatus.isAuthenticated
                            ? <Fragment>
                                <NavDropdown eventKey={1} title="Tenants" id="basic-nav-dropdown">
                                    <LinkContainer to="/tenant">
                                        <NavItem>Tenant List</NavItem>
                                    </LinkContainer>
                                    <MenuItem eventKey={1.2}>Another action</MenuItem>
                                    <MenuItem divider />
                                    <MenuItem eventKey={1.3}>Separated link</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={2} title="Bills" id="basic-nav-dropdown">
                                    <MenuItem eventKey={2.1}>Action</MenuItem>
                                    <MenuItem eventKey={2.2}>Another action</MenuItem>
                                    <MenuItem divider />
                                    <MenuItem eventKey={2.3}>Separated link</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Banking" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1}>Action</MenuItem>
                                    <MenuItem eventKey={3.2}>Another action</MenuItem>
                                    <MenuItem divider />
                                    <MenuItem eventKey={3.3}>Separated link</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={4} title="Misc" id="basic-nav-dropdown">
                                    <LinkContainer to="/usernotes">
                                        <NavItem>User Notes</NavItem>
                                    </LinkContainer>
                                    <LinkContainer to="/companyinfo">
                                        <NavItem>Company Info</NavItem>
                                    </LinkContainer>
                                    <MenuItem divider />
                                    <MenuItem eventKey={4.3}>Separated link</MenuItem>
                                </NavDropdown>
                                <NavItem onClick={this.handleLogout}>Logout</NavItem>
                            </Fragment>
                            : <Fragment>
                                <LinkContainer to="/signup">
                                    <NavItem>Signup</NavItem>
                                </LinkContainer>
                                <LinkContainer to="/login">
                                    <NavItem>Login</NavItem>
                                </LinkContainer>
                            </Fragment>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}