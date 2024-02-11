/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';

const Home = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async () => {
    history.push('/login');
  };

  if (!authState) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      <div>
        <Header as="h1">Opsvision Domo Dashboards with Okta Auth</Header>

        { authState.isAuthenticated && !userInfo
        && <div>Loading user information...</div>}

        {authState.isAuthenticated && userInfo
        && (
        <div>
          <p>
            Welcome, &nbsp;
            {userInfo.name}
            !
          </p>
          <p>
            You have successfully authenticated against your Okta org, and have been redirected back to this application.
            This application enables you to view private Domo Dashboards (called Private Embedded Dashboards) that your administrator has configured for you.

            You now have an ID token and access token in local storage.  Visit the
            {' '}
            <a href="/profile">My Profile</a>
            {' '}
            page to take a look inside the ID token that Okta has created.
          </p>
          <h3>Next Steps</h3>
          <p>Click on the Dashboard link in the top navigation to check out some of the cool dashboards available.  Enter a support ticket if you want to request a new Dashboard.</p>
          <p>
            If you are a developer, you can navigate to Github and check out the
            {' '}
            <a href="https://github.com/mitchellsjohnson/opsvision-domo-dashboards" target="_blank" rel="noreferrer noopener">Opsvision Domo Dashboards Repo</a>
            {' '}
            in Github.
          </p>

        </div>
        )}

        {!authState.isAuthenticated
        && (
        <div>
          <p>Welcome to the Opsvision Domo Dashboards application.</p>
          <p>
            This app enables you to view private Domo Dashboards that your administrator has configured for you.
          </p>
          <p>
            When you click the login button below, you will be presented the login page on the Okta Sign-In Widget hosted within the application.
            After you authenticate with your company Okta account (typically your email), you will be logged in to this application with an ID token and access token.
            These tokens will be stored in local storage and can be retrieved at a later time.
          </p>
          <Button id="login-button" primary onClick={login}>Login</Button>
        </div>
        )}

      </div>
    </div>
  );
};
export default Home;
