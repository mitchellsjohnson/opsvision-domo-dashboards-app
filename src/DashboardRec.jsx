/*
 * MIT License
 */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header, Icon, Message } from 'semantic-ui-react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import config from './config';

const DashboardRec = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [dashboard, setdashboard] = useState([]);
  const [dashboardFetchFailed, setdashboardFetchFailed] = useState(false);

  const { pk, sk } = useParams();
  const url = `${config.resourceServer.dashboardRecUrl}/${pk}/${sk}`;
  // fetch Dashboard Groups and associated Dashboards
  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      // get Dashboard data
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
            return {
              RowNum: index,
              pk: result.pk,
              sk: result.sk,
              dbName: result.dat,
            };
          });
          setdashboard(formattedResults);
          setdashboardFetchFailed(false);
        })
        .catch((err) => {
          setdashboardFetchFailed(true);
          /* eslint-disable no-console */
          console.error(err);
        });
    }
  }, [authState]);

  const possibleErrors = [
    'The OpsVision Server is running.',
    'Opsvision Server using the same Okta authorization server (issuer) that you have configured this React application to use.',
  ];

  return (
    <div>
      <Header as="h1">
        <Icon name="dashboard" />
        Dashboard
      </Header>
      {dashboardFetchFailed && (
        <Message
          error
          header="Failed to fetch Dashboard Group.  Please verify the following:"
          list={possibleErrors}
        />
      )}
      {!dashboard && !dashboardFetchFailed && <p>Fetching Dashboard Group..</p>}
      {dashboard && (
        <div>
          {dashboard.map((result) => (
            <Container key={result.pk + result.sk}>
              <Row>
                <Col>
                  Name:
                  <b>{result.dbName}</b>
                  {' '}
                </Col>
              </Row>
              <Row>
                <Col>
                  Unique Key:
                  {result.pk}
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col xs lg="1">
                  <Link
                    to={`/dashboard-rec-add-edit/${result.pk}/${result.sk}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="warning" size="lg">
                      Edit
                    </Button>
                  </Link>
                </Col>
                <Col xs lg="1">
                  <Link
                    to={`/dashboard-rec-add-edit/${result.pk}/${result.sk}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="danger" size="lg">
                      Delete
                    </Button>
                  </Link>
                </Col>
                <Col xs lg="2">
                  <Link
                    to="/dashboard-rec-add-edit/"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="success" size="lg">
                      Add New
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Container>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardRec;
