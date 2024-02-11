/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Header, Icon, Message } from 'semantic-ui-react';
import { CSVLink } from 'react-csv';

import config from './config';

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination,
  );

  // Render the UI for your table
  return (
    <>
      <BTable striped bordered hover size="sm" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    { () => {
                      if (column.isSorted) {
                        if (column.isSortedDesc) return ' 🔽';
                        return ' 🔼';
                      }
                      return '';
                    }}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
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
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} type="button">
          {'<<'}
        </button>
        {' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage} type="button">
          {'<'}
        </button>
        {' '}
        <button onClick={() => nextPage()} disabled={!canNextPage} type="button">
          {'>'}
        </button>
        {' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} type="button">
          {'>>'}
        </button>
        {' '}
        <span>
          &nbsp;
          Page
          {' '}
          {pageIndex + 1}
          {' '}
          of
          {' '}
          {pageOptions.length}
          {' '}
          | Go to page:
          {' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page1 = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page1);
            }}
            style={{ width: '100px' }}
          />
        </span>
        {' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize1) => (
            <option key={pageSize1} value={pageSize1}>
              Show
              {pageSize1}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

function MyCell({ value }) {
  let urlStr = '';
  let urlDisplay = '';
  if (value) {
    urlStr = value;
    urlDisplay = 'View';
  }
  return <a href={urlStr} target="_blank" rel="noreferrer">{urlDisplay}</a>;
}

const UsageTrackingLog = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardRecs, setDashboardRecs] = useState(null);
  const [dashboardRecFetchFailed, setDashboardRecFetchFailed] = useState(false);
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

  // fetch usage data
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      fetch(config.resourceServer.usageTrackingUrl, {
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
            // convert UTC to ETC
            const d = new Date(result.createdOn);
            const dtStrEst = d.toLocaleString('en-US', {
              timeZone: 'America/New_York',
            });
            const datasetDate = new Date();
            const datasetTimestamp = datasetDate.toISOString();
            const d1 = new Date(datasetTimestamp);
            const dtStrEst1 = d1.toLocaleString('en-US', {
              timeZone: 'America/New_York',
            });
            index += 1;
            return {
              rowNum: index,
              pk: result.pk,
              sk: result.sk,
              embedId: result.embedId,
              dashboardName: result.name,
              friendlyApi: result.friendlyApi,
              fullURL: result.fullURL,
              viewMode: result.viewMode,
              action: result.action,
              accessedBy: result.createdBy,
              accessedOn: dtStrEst,
              datasetTimestamp: dtStrEst1,
            };
          });
          setDashboardRecs(formattedResults);
          setDashboardRecFetchFailed(false);
        })
        .catch((err) => {
          setDashboardRecFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

  const data = dashboardRecs;

  const columns = React.useMemo(
    () => [
      {
        Header: 'Usage',
        columns: [
          {
            Header: 'Row #',
            accessor: 'rowNum',
          },
          {
            Header: 'Dashboard Name',
            accessor: 'dashboardName',
          },
          {
            Header: 'Embed Id',
            accessor: 'embedId',
          },
          {
            Header: 'View Mode',
            accessor: 'viewMode',
          },
          {
            Header: 'Full URL',
            accessor: 'fullURL',
            Cell: MyCell,
          },
          {
            Header: 'Accessed By',
            accessor: 'accessedBy',
          },
          {
            Header: 'Accessed On (EST)',
            accessor: 'accessedOn',
          },
          {
            Header: 'Unique Key of Dashboard',
            accessor: 'pk',
          },
          {
            Header: 'Dataset Timestamp (EST)',
            accessor: 'datasetTimestamp',
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
      <Header as="h1">
        <Icon name="chart bar outline" />
        Usage Log
      </Header>

      {dashboardRecFetchFailed && (
        <Message
          error
          header="Failed to fetch Usage Log.  Please verify the following:"
          list={possibleErrors}
        />
      )}
      {!dashboardRecs && !dashboardRecFetchFailed && (
        <p>Fetching Usage Log Records..</p>
      )}
      {dashboardRecs && (
        <div>
          <br />
          <CSVLink data={data} filename="Opsvision-stats">Download Usage Log in CSV</CSVLink>
          <br />
          <Table columns={columns} data={data} />
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

export default UsageTrackingLog;
