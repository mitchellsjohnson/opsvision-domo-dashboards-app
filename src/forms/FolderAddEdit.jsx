/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { useHistory, Link, useParams } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Table } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import config from '../config';

const FolderAddEdit = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [descErrorMsg, setDescErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pKey, setPKey] = useState('');
  const [folderRecFetchFailed, setfolderRecFetchFailed] = useState(false);
  const { pk, sk } = useParams();
  const [selected, setSelected] = useState([]);
  const [dashboardOptions, setDashboardOptions] = useState([]);
  const [dashboardOptionsFetchFailed, setDashboardOptionsFetchFailed] = useState(false);

  let addMode = true;
  let actionStr = 'Add';
  if (pk && sk) {
    addMode = false;
    actionStr = 'Edit';
  }

  const urlGroup = `${config.resourceServer.folderUrl}/${pk}/${sk}`;

  const handledNameChange = (event) => {
    setFolderName(event.target.value);
    setEmail(userInfo.email);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // fetch Dashboard List
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      fetch(config.resourceServer.dashboardRecListUrl, {
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
              rowNum: index,
              value: result.pk,
              label: result.dat,
            };
          });
          setDashboardOptions(formattedResults);
          setDashboardOptionsFetchFailed(false);
        })
        .catch((err) => {
          setDashboardOptionsFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

  // fetch folder, if one exists
  useEffect(() => {
    if (authState && authState.isAuthenticated && !addMode) {
      const accessToken = oktaAuth.getAccessToken();
      // get folder Group data
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
              folderName: result.dat,
              desc: result.description,
              associatedDashboards: result.dashboardList,
            };
          });
          setPKey(formattedResults[0].pk);
          setSelected(formattedResults[0].associatedDashboards);
          setfolderRecFetchFailed(false);
          setFolderName(formattedResults[0].folderName);
          setDescription(formattedResults[0].desc);
        })
        .catch((err) => {
          setfolderRecFetchFailed(true);
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
        body: JSON.stringify({ folderName, description, email, pk, selected }),
      };
      fetch(config.resourceServer.folderUrl, requestOptions)
        .then((response) => {
          if (response.status === 409) {
            setSuccessMsg();
            setNameErrorMsg('*ERROR:  Duplicate folder Group Name');
            return Promise.reject();
          }
          // status = 200 successful
          setNameErrorMsg();
          setDescErrorMsg();
          setSuccessMsg('Success!!!');
          return response.json();
        })
        .then((data) => {
          setPKey(data.pk);
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

        {authState.isAuthenticated && userInfo && !folderRecFetchFailed && !dashboardOptionsFetchFailed && (
          <div className="App d-flex flex-column">
            <Header as="h1">
              <Icon name="folder open outline" />
              {actionStr}
              &nbsp;Folder
            </Header>
            <div className="App successMsg">{successMsg}</div>
            {successMsg !== undefined
            && successMsg !== null
            && successMsg !== '' && (
            <div>
              <Link
                to="/folders"
                style={{ textDecoration: 'none' }}
              >
                Click Here to return to List of Folders...
              </Link>
              <div>
                <br />
              </div>
              <Link
                to={`/dashboard-rec-list/${pKey}/${folderName}`}
                style={{ textDecoration: 'none' }}
              >
                Click Here to view Dashboards in this Folder...
              </Link>
            </div>
            )}
            <br />
            <Form style={{ width: '600px' }} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Folder Name</Form.Label>
                <Form.Control
                  type="text"
                  name="folderName"
                  onChange={handledNameChange}
                  value={folderName}
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
              <Form.Group>
                <div className="App errorMsg">{descErrorMsg}</div>
                <Form.Label>Add/Remove Dashboards to Folder</Form.Label>
                <MultiSelect
                  options={dashboardOptions}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select"
                  isCreatable
                />
                <br />
                <br />
                {selected.length > 0 && (
                  <div>
                    <Form.Label>Dashboards in Folder</Form.Label>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Dashboard Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.map((dashboard) => (
                          <tr id={dashboard.rowNum} key={dashboard.rowNum}>
                            <td>{dashboard.label}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Form.Group>
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
            <p>Welcome to the Opsvision Domo folders application.</p>
            <p>
              This app enables you to view private Domo folders that your
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
export default FolderAddEdit;
