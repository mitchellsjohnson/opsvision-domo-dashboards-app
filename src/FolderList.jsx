/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Header, Icon, Message, Popup } from 'semantic-ui-react';
import config from './config';
import utils from './utils';

const Folders = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [folderViewRecs, setFolderViewRecs] = useState(null);
  const [folderViewRecsFetchFailed, setFolderViewRecsFetchFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const history = useHistory();
  const { teampk, teamName } = useParams();
  const login = async () => {
    history.push('/login');
  };
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

  // fetch messages
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      let url = config.resourceServer.folderListUrl;
      if (teampk) {
        url = `${url}/${teampk}`;
      }
      fetch(url, {
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
            let createdDtStamp = '';
            if (result.createdOn !== null && result.createdOn !== '') {
              createdDtStamp = utils.dateFunctions.formatDate(
                new Date(result.createdOn),
                2,
              );
            }
            let dashboardCount = 0;
            if (result.dashboardList) {
              dashboardCount = result.dashboardList.length;
            }
            return {
              rowNum: index,
              pk: result.pk,
              sk: result.sk,
              folderName: result.dat,
              dbCount: dashboardCount,
              createdBy: result.createdBy,
              createdOn: createdDtStamp,
            };
          });
          // create friendly view data object
          const existValCount = formattedResults.length;
          let iterator = 0;
          const rowSize = 4;
          let colPlacement = 0;
          const jsonArr = [];
          let pk1 = '';
          let sk1 = '';
          let folderName1 = '';
          let createdBy1 = '';
          let createdOn1 = '';
          let dbCount1 = 0;
          let pk2 = '';
          let sk2 = '';
          let folderName2 = '';
          let createdBy2 = '';
          let createdOn2 = '';
          let dbCount2 = 0;
          let pk3 = '';
          let sk3 = '';
          let folderName3 = '';
          let createdBy3 = '';
          let createdOn3 = '';
          let dbCount3 = 0;
          let pk4 = '';
          let sk4 = '';
          let folderName4 = '';
          let createdBy4 = '';
          let createdOn4 = '';
          let rowNumView = 0;
          let dbCount4 = 0;

          for (let i = 0; i < existValCount; i += 1) {
            colPlacement = (i + 1) - (rowSize * iterator);
            rowNumView += 1;
            if (colPlacement === 1) {
              pk1 = formattedResults[i].pk;
              sk1 = formattedResults[i].sk;
              folderName1 = formattedResults[i].folderName;
              createdBy1 = formattedResults[i].createBy;
              createdOn1 = formattedResults[i].createdOn;
              dbCount1 = formattedResults[i].dbCount;
            } else if (colPlacement === 2) {
              pk2 = formattedResults[i].pk;
              sk2 = formattedResults[i].sk;
              folderName2 = formattedResults[i].folderName;
              createdBy2 = formattedResults[i].createBy;
              createdOn2 = formattedResults[i].createdOn;
              dbCount2 = formattedResults[i].dbCount;
            } else if (colPlacement === 3) {
              pk3 = formattedResults[i].pk;
              sk3 = formattedResults[i].sk;
              folderName3 = formattedResults[i].folderName;
              createdBy3 = formattedResults[i].createBy;
              createdOn3 = formattedResults[i].createdOn;
              dbCount3 = formattedResults[i].dbCount;
            } else if (colPlacement === 4) {
              pk4 = formattedResults[i].pk;
              sk4 = formattedResults[i].sk;
              folderName4 = formattedResults[i].folderName;
              createdBy4 = formattedResults[i].createBy;
              createdOn4 = formattedResults[i].createdOn;
              dbCount4 = formattedResults[i].dbCount;
              jsonArr.push({
                rowNum: rowNumView,
                pk_1: pk1,
                pk_2: pk2,
                pk_3: pk3,
                pk_4: pk4,
                sk_1: sk1,
                sk_2: sk2,
                sk_3: sk3,
                sk_4: sk4,
                folderName_1: folderName1,
                folderName_2: folderName2,
                folderName_3: folderName3,
                folderName_4: folderName4,
                createdBy_1: createdBy1,
                createdBy_2: createdBy2,
                createdBy_3: createdBy3,
                createdBy_4: createdBy4,
                createdOn_1: createdOn1,
                createdOn_2: createdOn2,
                createdOn_3: createdOn3,
                createdOn_4: createdOn4,
                dbcount_1: dbCount1,
                dbcount_2: dbCount2,
                dbcount_3: dbCount3,
                dbcount_4: dbCount4,
              });
              iterator += 1;
            }
            if ((i + 1) === existValCount) {
              if (colPlacement === 1) {
                jsonArr.push({
                  rowNum: rowNumView,
                  pk_1: pk1,
                  sk_1: sk1,
                  folderName_1: folderName1,
                  createdBy_1: createdBy1,
                  createdOn_1: createdOn1,
                  dbcount_1: dbCount1,
                });
              } else if (colPlacement === 2) {
                jsonArr.push({
                  rowNum: rowNumView,
                  pk_1: pk1,
                  pk_2: pk2,
                  sk_1: sk1,
                  sk_2: sk2,
                  folderName_1: folderName1,
                  folderName_2: folderName2,
                  createdBy_1: createdBy1,
                  createdBy_2: createdBy2,
                  createdOn_1: createdOn1,
                  createdOn_2: createdOn2,
                  dbcount_1: dbCount1,
                  dbcount_2: dbCount1,
                });
              } else if (colPlacement === 3) {
                jsonArr.push({
                  rowNum: rowNumView,
                  pk_1: pk1,
                  pk_2: pk2,
                  pk_3: pk3,
                  sk_1: sk1,
                  sk_2: sk2,
                  sk_3: sk3,
                  folderName_1: folderName1,
                  folderName_2: folderName2,
                  folderName_3: folderName3,
                  createdBy_1: createdBy1,
                  createdBy_2: createdBy2,
                  createdBy_3: createdBy3,
                  createdOn_1: createdOn1,
                  createdOn_2: createdOn2,
                  createdOn_3: createdOn3,
                  dbcount_1: dbCount1,
                  dbcount_2: dbCount2,
                  dbcount_3: dbCount3,
                });
              }
            }
          }
          setFolderViewRecs(jsonArr);
          setFolderViewRecsFetchFailed(false);
        })
        .catch((err) => {
          setFolderViewRecsFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);
  const handleDelete = (pk) => {
    // Conditional logic:
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ pk }),
      };
      fetch(config.resourceServer.folderUrl, requestOptions)
        .then((response) => {
          console.log('Submitted successfully');

          if (response.status === 200) {
            window.location.reload(false);
          } else if (response.status === 409) {
            setErrorMsg(
              'Dashboard Record delete Failed.  Please contact your administrator.',
            );
          }
        })
        .catch((error) => console.log('Delete submit error', error));
    }
  };

  const possibleErrors = [
    "You've downloaded one of our resource server examples, and it's running on port 8000.",
    'Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.',
    `Error Msg:  ${errorMsg}`,
  ];

  if (!userInfo) {
    return (
      <div>
        <p>Fetching user profile...</p>
      </div>
    );
  }

  return (
    <div>

      {!teampk && (
        <div>
          <Header as="h1">
            <Icon name="folder open outline" />
            Folders
          </Header>
        </div>
      )}
      {teampk && (
        <div>
          <Header as="h1">
            <Icon name="users" />
            {`Team:  ${teamName}`}
          </Header>
        </div>
      )}

      {folderViewRecsFetchFailed && (
        <Message
          error
          header="Failed to fetch Folders.  Please verify the following:"
          list={possibleErrors}
        />
      )}
      {!folderViewRecs && !folderViewRecsFetchFailed && (
        <p>Fetching Folder Records..</p>
      )}
      {folderViewRecs && (
        <div>
          <Container key="addDBR">
            <Row>
              <Col>
                <Link
                  to="/folder-add-edit/"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="outline-primary" size="med">
                    Add New
                  </Button>
                </Link>
              </Col>
            </Row>
          </Container>
          <div><br /></div>
          <Container>
            {folderViewRecs.map((folder) => (
              <div id={folder.rowNum} key={folder.rowNum}>
                <Row>
                  {folder.folderName_1 && (
                    <Col>
                      <Link
                        to={`/dashboard-rec-list/${folder.pk_1}/${folder.folderName_1}`}
                        style={{ color: 'black', fontSize: '150%', fontWeight: 'bold', textDecoration: 'none' }}
                      >
                        <Icon color="grey" name="folder open outline" size="massive" />
                        <br />
                        {folder.folderName_1}
                        &nbsp;
                        {'('}
                        {folder.dbcount_1}
                        {')'}
                      </Link>
                      <br />
                      <Link
                        to={`/dashboard-rec-list/${folder.pk_1}/${folder.folderName_1}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Popup
                          trigger={<Icon color="grey" name="eye" size="large" />}
                          content="View Dashboards in Folder..."
                          position="bottom center"
                        />
                      </Link>
                      &nbsp;&nbsp;
                      <Link
                        to={`/folder-add-edit/${folder.pk_1}/${folder.sk_1}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Popup
                          trigger={<Icon color="grey" name="edit outline" size="large" />}
                          content="Edit folder name or add/remove Dashboards..."
                          position="bottom center"
                        />
                      </Link>
                      <Button variant="outline-light" size="sm" onClick={() => handleDelete(folder.pk_1)}>
                        <Popup
                          trigger={<Icon color="grey" name="delete" size="large" />}
                          content="Delete Folder.  Note this will not delete dashboards in folder!..."
                          position="bottom center"
                        />
                      </Button>
                    </Col>
                  )}
                  {folder.folderName_2 && (
                  <Col>
                    <Link
                      to={`/dashboard-rec-list/${folder.pk_2}/${folder.folderName_2}`}
                      style={{ color: 'black', fontSize: '150%', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      <Icon color="grey" name="folder open outline" size="massive" />
                      <br />
                      {folder.folderName_2}
                      &nbsp;
                      {'('}
                      {folder.dbcount_2}
                      {')'}
                    </Link>
                    <br />
                    <Link
                      to={`/dashboard-rec-list/${folder.pk_2}/${folder.folderName_2}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Popup
                        trigger={<Icon color="grey" name="eye" size="large" />}
                        content="View Dashboards in Folder..."
                        position="bottom center"
                      />
                    </Link>
                    &nbsp;&nbsp;
                    <Link
                      to={`/folder-add-edit/${folder.pk_2}/${folder.sk_2}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Popup
                        trigger={<Icon color="grey" name="edit outline" size="large" />}
                        content="Edit folder name or add/remove Dashboards..."
                        position="bottom center"
                      />
                    </Link>
                    <Button variant="outline-light" size="sm" onClick={() => handleDelete(folder.pk_2)}>
                      <Popup
                        trigger={<Icon color="grey" name="delete" size="large" />}
                        content="Delete Folder.  Note this will not delete dashboards in folder!..."
                        position="bottom center"
                      />
                    </Button>
                  </Col>
                  )}
                  {folder.folderName_3 && (
                  <Col>
                    <Link
                      to={`/dashboard-rec-list/${folder.pk_3}/${folder.folderName_3}`}
                      style={{ color: 'black', fontSize: '150%', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      <Icon color="grey" name="folder open outline" size="massive" />
                      <br />
                      {folder.folderName_3}
                      &nbsp;
                      {'('}
                      {folder.dbcount_3}
                      {')'}
                    </Link>
                    <br />
                    <Link
                      to={`/dashboard-rec-list/${folder.pk_3}/${folder.folderName_3}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Popup
                        trigger={<Icon color="grey" name="eye" size="large" />}
                        content="View Dashboards in Folder..."
                        position="bottom center"
                      />
                    </Link>
                    &nbsp;&nbsp;
                    <Link
                      to={`/folder-add-edit/${folder.pk_3}/${folder.sk_3}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Popup
                        trigger={<Icon color="grey" name="edit outline" size="large" />}
                        content="Edit folder name or add/remove Dashboards..."
                        position="bottom center"
                      />
                    </Link>
                    <Button variant="outline-light" size="sm" onClick={() => handleDelete(folder.pk_3)}>
                      <Popup
                        trigger={<Icon color="grey" name="delete" size="large" />}
                        content="Delete Folder.  Note this will not delete dashboards in folder!..."
                        position="bottom center"
                      />
                    </Button>
                  </Col>
                  )}
                  {folder.folderName_4 && (
                  <Col>
                    <Link
                      to={`/dashboard-rec-list/${folder.pk_4}/${folder.folderName_4}`}
                      style={{ color: 'black', fontSize: '150%', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                      <Icon color="grey" name="folder open outline" size="massive" />
                      <br />
                      {folder.folderName_4}
                      &nbsp;
                      {'('}
                      {folder.dbcount_4}
                      {')'}
                    </Link>
                    <br />
                    <Link
                      to={`/dashboard-rec-list/${folder.pk_4}/${folder.folderName_4}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Popup
                        trigger={<Icon color="grey" name="eye" size="large" />}
                        content="View Dashboards in Folder..."
                        position="bottom center"
                      />
                    </Link>
                    &nbsp;&nbsp;
                    <Link
                      to={`/folder-add-edit/${folder.pk_4}/${folder.sk_4}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Popup
                        trigger={<Icon color="grey" name="edit outline" size="large" />}
                        content="Edit folder name or add/remove Dashboards..."
                        position="bottom center"
                      />
                    </Link>
                    <Button variant="outline-light" size="sm" onClick={() => handleDelete(folder.pk_4)}>
                      <Popup
                        trigger={<Icon color="grey" name="delete" size="large" />}
                        content="Delete Folder.  Note this will not delete dashboards in folder!..."
                        position="bottom center"
                      />
                    </Button>
                  </Col>
                  )}
                </Row>
                <br />
              </div>
            ))}
          </Container>
        </div>
      )}
      {!authState.isAuthenticated && (
        <div>
          <p>Welcome to the Opsvision Domo Folders application.</p>
          <p>
            This app enables you to view private Domo Folders that your
            administrator has configured for you.
          </p>
          <p>
            When you click the login button below, you will be presented the
            login page on the Okta Sign-In Widget hosted within the application.
            After you authenticate with your company Okta account (typically
            your email), you will be logged in to this application with an ID
            token and access token. These tokens will be stored in local storage
            and can be retrieved at a later time.
          </p>
          <Button id="login-button" primary onClick={login}>
            Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default Folders;
