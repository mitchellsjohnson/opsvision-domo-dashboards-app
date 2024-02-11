/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import config from '../config';

const DashboardRecAddEdit = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [dName, setdName] = useState('');
  const [encodedDName, setEncodedDName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [descErrorMsg, setDescErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [embedId, setEmbedId] = useState('');
  const [embedIdErrorMsg, setEmbedIdErrorMsg] = useState('');
  const [dashboardRecFetchFailed, setDashboardRecFetchFailed] = useState(false);
  const { pk, sk } = useParams();
  let addMode = true;
  let actionStr = 'Add';
  if (pk && sk) {
    addMode = false;
    actionStr = 'Edit';
  }

  const urlGroup = `${config.resourceServer.dashboardRecUrl}/${pk}/${sk}`;

  const handledNameChange = (event) => {
    setdName(event.target.value);
    setEncodedDName(encodeURIComponent(event.target.value));
    setEmail(userInfo.email);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleEmbedIdChange = (event) => {
    setEmbedId(event.target.value);
  };

  // fetch Dashboard Group, if one exists
  useEffect(() => {
    if (authState && authState.isAuthenticated && !addMode) {
      const accessToken = oktaAuth.getAccessToken();
      // get Dashboard Group data
      fetch(urlGroup, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.json();
        })
        .then((data) => {
          let index = 0;
          const formattedResults = data.results.map((result) => {
            index += 1;
            return {
              RowNum: index,
              pk: result.pk,
              sk: result.sk,
              dashboardName: result.dat,
              desc: result.description,
              embedId: result.embedId,
            };
          });
          setDashboardRecFetchFailed(false);
          setdName(formattedResults[0].dashboardName);
          setEncodedDName(encodeURIComponent(formattedResults[0].dashboardName));
          setDescription(formattedResults[0].desc);
          setEmbedId(formattedResults[0].embedId);
        })
        .catch((err) => {
          setDashboardRecFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Conditional logic:
    const x = 1;
    if (x === 2) {
      // We got errors!  TODO
      // setErrors(newErrors)
    } else if (authState && authState.isAuthenticated) {
      let methodStr = '';
      if (addMode) {
        methodStr = 'POST';
      } else {
        methodStr = 'PUT';
      }
      const accessToken = oktaAuth.getAccessToken();
      const requestOptions = {
        method: methodStr,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ dName, description, email, embedId, pk }),
      };
      fetch(config.resourceServer.dashboardRecUrl, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            // duplicate
            setNameErrorMsg();
            setDescErrorMsg();
            setEmbedIdErrorMsg();
            setSuccessMsg('Success!!!');
          } else if (response.status === 409) {
            setSuccessMsg();
            setNameErrorMsg('*ERROR:  Duplicate Dashboard Group Name');
          }
        })
        .catch((error) => console.log('Form submit error', error));
    }
  };

  if (!authState) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {authState.isAuthenticated && !userInfo && (
          <div>Loading user information...</div>
        )}

        {authState.isAuthenticated && userInfo && !dashboardRecFetchFailed && (
          <div className="App d-flex flex-column">
            <Header as="h1">
              <Icon name="dashboard" />
              {actionStr}
              Dashboard Name
            </Header>
            <div className="App successMsg">{successMsg}</div>
            {successMsg !== undefined
            && successMsg !== null
            && successMsg !== '' && (
            <div>
              <Link
                to="/dashboard-rec-list"
                style={{ textDecoration: 'none' }}
              >
                Click Here to return to LIST of Dashboards...
              </Link>
              <div>
                <br />
              </div>
              <Link
                to={`/dashboard/${embedId}/full/${pk}/${encodedDName}`}
                style={{ textDecoration: 'none' }}
                target="_blank"
              >
                Click Here to view THIS Dashboard FullScreen...
              </Link>
            </div>
            )}
            <br />
            <Form style={{ width: '300px' }} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Dashboard Name</Form.Label>
                <Form.Control
                  type="text"
                  name="dName"
                  onChange={handledNameChange}
                  value={dName}
                  maxLength="50"
                />
              </Form.Group>
              <div className="App errorMsg">{nameErrorMsg}</div>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  onChange={handleDescriptionChange}
                  value={description}
                  maxLength="200"
                />
              </Form.Group>
              <div className="App errorMsg">{descErrorMsg}</div>
              <Form.Group>
                <Form.Label>Embed Id</Form.Label>
                <Form.Control
                  type="text"
                  name="embedId"
                  onChange={handleEmbedIdChange}
                  value={embedId}
                  maxLength="5"
                />
              </Form.Group>
              <div className="App errorMsg">{embedIdErrorMsg}</div>
              <Form.Group>
                <Form.Control name="email" value={email} type="hidden" />
              </Form.Group>
              <Form.Group>
                <Form.Control name="pk" value={pk} type="hidden" />
              </Form.Group>
              <br />
              <Button type="submit" variant="outline-primary">Submit</Button>
            </Form>
          </div>
        )}
        {!authState.isAuthenticated && (
          <div>
            <p>Welcome to the Opsvision Domo Dashboards application.</p>
            <p>
              This app enables you to view private Domo Dashboards that your
              administrator has configured for you.
            </p>
            <p>
              When you click the login button below, you will be presented the
              login page on the Okta Sign-In Widget hosted within the
              application. After you authenticate with your company Okta account
              (typically your email), you will be logged in to this application
              with an ID token and access token. These tokens will be stored in
              local storage and can be retrieved at a later time.
            </p>
            <Button id="login-button" primary onClick={login}>
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardRecAddEdit;
