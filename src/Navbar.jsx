/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { useHistory } from 'react-router-dom';
// import { Container, Icon, Image, Menu, Dropdown } from 'semantic-ui-react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const Navbar1 = ({ setCorsErrorModalOpen }) => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();

  const login = async () => history.push('/login');

  // Note: Can't distinguish CORS error from other network errors
  const isCorsError = (err) => (err.name === 'AuthApiError' && !err.errorCode && err.xhr.message === 'Failed to fetch');

  const logout = async () => {
    const basename = window.location.origin + history.createHref({ pathname: '/' });
    try {
      await oktaAuth.signOut({ postLogoutRedirectUri: basename });
    } catch (err) {
      if (isCorsError(err)) {
        setCorsErrorModalOpen(true);
      } else {
        throw err;
      }
    }
  };

  if (!authState) {
    return null;
  }

  return (
    <div>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="/">
          <img
            alt=""
            src="/opsvision2.svg"
            width="30"
            height="30"
          />
          {' '}
          Opsvision Domo Dashboards
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>

            {authState.isAuthenticated && (
            <Nav.Link id="profile-button" href="/profile">Profile</Nav.Link>
            )}
            {authState.isAuthenticated && (
            <NavDropdown title="Tools" id="dashboard-button">
              <NavDropdown.Item href="/teams">Teams</NavDropdown.Item>
              <NavDropdown.Item href="/folders">Folders</NavDropdown.Item>
              <NavDropdown.Item href="/dashboard-rec-list">Dashboards</NavDropdown.Item>
              <NavDropdown.Item href="/usage-tracking-log">Usage Tracking</NavDropdown.Item>
            </NavDropdown>
            )}
            {authState.isAuthenticated && (
            <Nav.Link id="logout-button" onClick={logout}>Logout</Nav.Link>
            )}
            {!authState.isPending && !authState.isAuthenticated && (
            <Nav.Link id="login-button" onClick={login}>Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
export default Navbar1;
