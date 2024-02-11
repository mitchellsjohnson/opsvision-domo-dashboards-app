const CLIENT_ID = process.env.OKTA_CLIENT_ID || '{clientId}';
const ISSUER = process.env.OKTA_ISSUER || 'https://{yourOktaDomain}.com/oauth2/default';
const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
const BASENAME = process.env.PUBLIC_URL || '';
const REDIRECT_URI = `${window.location.origin}${BASENAME}/login/callback`;
const MESSAGE_API = `${process.env.REACT_APP_SERVER_BASE_URL}/api/messages`;
const DASHBOARD_REC_API = `${process.env.REACT_APP_SERVER_BASE_URL}/api/dashboard-rec`;
const DASHBOARD_REC_LIST_API = `${process.env.REACT_APP_SERVER_BASE_URL}/api/dashboard-rec-list`;
const FOLDER_API = `${process.env.REACT_APP_SERVER_BASE_URL}/api/folder`;
const FOLDER_LIST_API = `${process.env.REACT_APP_SERVER_BASE_URL}/api/folder-list`;
const TEAM_API = `${process.env.REACT_APP_SERVER_BASE_URL}/api/team`;

const TEAM_LIST_API = `${process.env.REACT_APP_SERVER_BASE_URL}/api/team-list`;
const USAGE_TRACKING_API = `${process.env.REACT_APP_SERVER_BASE_URL}/api/usage_tracking`;

let USE_INTERACTION_CODE = false;
if (process.env.USE_INTERACTION_CODE === 'true') {
  USE_INTERACTION_CODE = true;
}

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
    useInteractionCode: USE_INTERACTION_CODE,
  },
  resourceServer: {
    messagesUrl: MESSAGE_API,
    dashboardRecListUrl: DASHBOARD_REC_LIST_API,
    dashboardRecUrl: DASHBOARD_REC_API,
    usageTrackingUrl: USAGE_TRACKING_API,
    folderListUrl: FOLDER_LIST_API,
    folderUrl: FOLDER_API,
    teamListUrl: TEAM_LIST_API,
    teamUrl: TEAM_API,
  },
  app: {
    basename: BASENAME,
  },
};
