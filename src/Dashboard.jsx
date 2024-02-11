/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Header, Button } from 'semantic-ui-react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const { embedId, viewMode, pk, dbName } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [srcURL, setSrcURL] = useState(null);

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
  let port = '';
  if (window.location.port) {
    port = window.location.port;
  } else if (window.location.protocol === 'https:') {
    port = '443';
  } else port = '80';
  const baseSrcURL = `${process.env.REACT_APP_SERVER_BASE_URL}/domo_iframe/${embedId}/${viewMode}/${pk}/${dbName}/${window.location.protocol}/${window.location.hostname}/${port}`;

  // fetch iframe src
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      fetch(baseSrcURL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.blob();
        })
        .then((response) => {
          // const binaryData = [];
          // binaryData.push(response);
          // const blob = response.blob();
          // console.log('blob:  ', blob);
          // const urlObject = URL.createObjectURL(new Blob(binaryData, { type: 'text/html' }));
          const urlObject = URL.createObjectURL(response);
          setSrcURL(urlObject);
          // document.querySelector('iframe').setAttribute('src', urlObject);
        })
        .catch((err) => {
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

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
          <Container key="dbRecList">
            <Row>
              <Col>
                <Link
                  to="/dashboard-rec-list"
                  style={{ textDecoration: 'none' }}
                >
                  Return to Dashboard List
                </Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Link
                  to={`/dashboard/${embedId}/full/${pk}/${dbName}`}
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  View Dashboard in Full Screen
                </Link>
              </Col>
            </Row>
          </Container>
          <br />
          <iframe className="iframefull" id="iframe" title="Domo Dashboard" src={srcURL} frameBorder="0" width="1200" height="800" scrolling="yes"> </iframe>
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

export default Dashboard;
