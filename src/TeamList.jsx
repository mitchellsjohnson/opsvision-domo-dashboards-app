/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import { useTable } from 'react-table';
import { Header, Icon, Message } from 'semantic-ui-react';
import config from './config';
import utils from './utils';

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <BTable striped bordered hover size="sm" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </BTable>
  );
}

const Teams = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [teamRecs, setTeamRecs] = useState(null);
  const [teamRecFetchFailed, setTeamRecFetchFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [teamRecLength, setTeamRecLength] = useState('');
  const history = useHistory();

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

  // fetch teams
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      const url = config.resourceServer.teamListUrl;
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
            const teamNameEncoded = encodeURIComponent(result.dat);
            return {
              rowNum: index,
              pk: result.pk,
              sk: result.sk,
              teamName: result.dat,
              teamNameEncode: teamNameEncoded,
              folderList: result.folderList,
              createdBy: result.createdBy,
              createdOn: createdDtStamp,
            };
          });
          setTeamRecLength(formattedResults.length);
          setTeamRecs(formattedResults);
          setTeamRecFetchFailed(false);
        })
        .catch((err) => {
          setTeamRecFetchFailed(true);
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
      fetch(config.resourceServer.teamUrl, requestOptions)
        .then((response) => {
          console.log('Submitted successfully');

          if (response.status === 200) {
            window.location.reload(false);
          } else if (response.status === 409) {
            setErrorMsg(
              'Team Record delete Failed.  Please contact your administrator.',
            );
            console.log('error msg:  ', errorMsg);
          }
        })
        .catch((error) => console.log('Delete submit error', error));
    }
  };
  const data = teamRecs;
  const columns = React.useMemo(
    () => [
      {
        Header: 'Teams',
        columns: [
          {
            Header: 'Row #',
            accessor: 'rowNum',
          },
          {
            Header: 'Team Name',
            accessor: 'teamName',
          },
          {
            Header: 'Created By',
            accessor: 'createdBy',
          },
          {
            Header: 'Created On',
            accessor: 'createdOn',
          },
          {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => {
              const data1 = row.original;

              return (
                <div>
                  <Link
                    to={`/folders/${data1.pk}/${data1.teamNameEncode}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="outline-primary" size="sm">
                      View Folders for Team
                    </Button>
                  </Link>
                  &nbsp;
                  <Link
                    to={`/team-add-edit/${data1.pk}/${data1.sk}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="outline-warning" size="sm">
                      Edit
                    </Button>
                  </Link>
                  &nbsp;
                  <Button
                    onClick={() => handleDelete(data1.pk)}
                    variant="outline-danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              );
            },
          },
        ],
      },
    ],
    [],
  );

  const possibleErrors = [
    "You've downloaded one of our resource server examples, and it's running on port 8000.",
    'Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.',
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
      <div>
        <Header as="h1">
          <Icon name="users" />
          Teams
        </Header>
      </div>

      {teamRecFetchFailed && (
        <Message
          error
          header="Failed to fetch Teams.  Please verify the following:"
          list={possibleErrors}
        />
      )}
      {!teamRecs && !teamRecFetchFailed && (
        <p>Fetching Teams...</p>
      )}
      {teamRecs && (
        <div>
          <Container key="addTeamRec">
            <Row>
              <Col>
                <Link
                  to="/team-add-edit/"
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
          <Table columns={columns} data={data} />
        </div>
      )}
      {teamRecLength === 0 && (
        <div>
          No Teams
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

export default Teams;
