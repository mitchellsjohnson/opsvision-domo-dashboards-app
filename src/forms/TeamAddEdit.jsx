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

const TeamAddEdit = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [descErrorMsg, setDescErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pKey, setPKey] = useState('');
  const [teamRecFetchFailed, setTeamRecFetchFailed] = useState(false);
  const { pk, sk } = useParams();
  const [selected, setSelected] = useState([]);
  const [folderOptions, setFolderOptions] = useState([]);
  const [folderOptionsFetchFailed, setFolderOptionsFetchFailed] = useState(false);

  let addMode = true;
  let actionStr = 'Add';
  if (pk && sk) {
    addMode = false;
    actionStr = 'Edit';
  }

  const urlGroup = `${config.resourceServer.teamUrl}/${pk}/${sk}`;

  const handledNameChange = (event) => {
    setTeamName(event.target.value);
    setEmail(userInfo.email);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // fetch folder List
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      fetch(config.resourceServer.folderListUrl, {
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
          setFolderOptions(formattedResults);
          setFolderOptionsFetchFailed(false);
        })
        .catch((err) => {
          setFolderOptionsFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

  // fetch team, if one exists
  useEffect(() => {
    if (authState && authState.isAuthenticated && !addMode) {
      const accessToken = oktaAuth.getAccessToken();
      // get team Group data
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
              teamName: result.dat,
              desc: result.description,
              associatedFolders: result.folderList,
            };
          });
          setPKey(formattedResults[0].pk);
          setSelected(formattedResults[0].associatedFolders);
          setTeamRecFetchFailed(false);
          setTeamName(formattedResults[0].teamName);
          setDescription(formattedResults[0].desc);
          setFolderOptionsFetchFailed(false);
        })
        .catch((err) => {
          setTeamRecFetchFailed(true);
          setFolderOptionsFetchFailed(false);
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
        body: JSON.stringify({ teamName, description, email, pk, selected }),
      };
      fetch(config.resourceServer.teamUrl, requestOptions)
        .then((response) => {
          if (response.status === 409) {
            setSuccessMsg();
            setNameErrorMsg('*ERROR:  Duplicate team Group Name');
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

        {authState.isAuthenticated && userInfo && !teamRecFetchFailed && !folderOptionsFetchFailed && (
          <div className="App d-flex flex-column">
            <Header as="h1">
              <Icon name="users" />
              {actionStr}
              &nbsp;team
            </Header>
            <div className="App successMsg">{successMsg}</div>
            {successMsg !== undefined
            && successMsg !== null
            && successMsg !== '' && (
            <div>
              <Link
                to="/teams"
                style={{ textDecoration: 'none' }}
              >
                Click Here to return to List of Teams...
              </Link>
              <div>
                <br />
              </div>
              <Link
                to={`/folders/${pKey}/${teamName}`}
                style={{ textDecoration: 'none' }}
              >
                Click Here to view Folders associated with this Team...
              </Link>
            </div>
            )}
            <br />
            <Form style={{ width: '600px' }} onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Team Name</Form.Label>
                <Form.Control
                  type="text"
                  name="teamName"
                  onChange={handledNameChange}
                  value={teamName}
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
                <Form.Label>Click Here to Add/Remove Folder to Team</Form.Label>
                <MultiSelect
                  options={folderOptions}
                  value={selected}
                  onChange={setSelected}
                  labelledBy="Select"
                  isCreatable
                />
                <br />
                <br />
                {selected.length > 0 && (
                  <div>
                    <Form.Label>Folders in Team</Form.Label>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Folder Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.map((folder) => (
                          <tr id={folder.rowNum} key={folder.rowNum}>
                            <td>{folder.label}</td>
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
            <p>Welcome to the Opsvision Domo teams application.</p>
            <p>
              This app enables you to view private Domo teams that your
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
export default TeamAddEdit;
