/*
 * MIT License
 */

import React from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
// import { Container } from 'semantic-ui-react';
import { Container } from 'react-bootstrap';
import config from './config';
import Home from './Home';
import CustomLoginComponent from './Login';
import Messages from './Messages';
import Navbar1 from './Navbar';
import Profile from './Profile';
import Dashboard from './Dashboard';
import CorsErrorModal from './CorsErrorModal';
import DashboardRec from './DashboardRec';
import DashboardRecList from './DashboardRecList';
import DashboardRecAddEdit from './forms/DashboardRecAddEdit';
import FolderAddEdit from './forms/FolderAddEdit';
import FolderList from './FolderList';
import TeamList from './TeamList';
import TeamAddEdit from './forms/TeamAddEdit';
import UsageTrackingLog from './UsageTrackingLog';

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {
  const history = useHistory(); // example from react-router

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  const customAuthHandler = () => {
    // Redirect to the /login page that has a CustomLoginComponent
    history.push('/login');
  };

  const onAuthResume = async () => {
    history.push('/login');
  };

  const [corsErrorModalOpen, setCorsErrorModalOpen] = React.useState(false);

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Navbar1 {...{ setCorsErrorModalOpen }} />
      <CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
      <Container style={{ marginTop: '2em' }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login/callback" render={(props) => <LoginCallback {...props} onAuthResume={onAuthResume} />} />
          <Route path="/login" render={() => <CustomLoginComponent {...{ setCorsErrorModalOpen }} />} />
          <SecureRoute path="/messages" component={Messages} />
          <SecureRoute path="/dashboard-rec-list/:folderpk?/:folderName?" component={DashboardRecList} />
          <SecureRoute path="/profile" component={Profile} />
          <SecureRoute path="/dashboard/:embedId/:viewMode/:pk/:dbName" component={Dashboard} />
          <SecureRoute path="/dashboard-rec/:pk?/:sk?" component={DashboardRec} />
          <SecureRoute path="/folders/:teampk?/:teamName?" component={FolderList} />
          <SecureRoute path="/folder-add-edit/:pk?/:sk?" component={FolderAddEdit} />
          <SecureRoute path="/dashboard-rec-add-edit/:pk?/:sk?" component={DashboardRecAddEdit} />
          <SecureRoute path="/team-add-edit/:pk?/:sk?" component={TeamAddEdit} />
          <SecureRoute path="/teams" component={TeamList} />
          <SecureRoute path="/usage-tracking-log" component={UsageTrackingLog} />
        </Switch>
      </Container>
    </Security>
  );
};

export default App;
