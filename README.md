# Opsvision Domo Dashboards
Opsvision Domo Dashboards is an app suite that enables the secure sharing of Domo "private embed" dashboards and cards with authorized users.   

Opsvision Domo Dashboards consists of two separate apps:
1. App:  React app styled with React-Bootstrap secured by Okta authentication.  This repository houses the React App.
2. Server:  NodeJS express server app that integrates with Domo Javascript SDK.  The server repository is found at:  https://github.com/mitchellsjohnson/opsvision-domo-dashboards-server

Key technologies in Use:
App
1. React (SinglePageApp)
2. React Bootstrap
3. OKTA (authentication)
4. AWS CloudFormation
5. AWS CodePipeline/CodeBuild (CD/CI)
6. AWS Secrets Manager
7. AWS S3
8. AWS Cloudfront (deployment)

Server
1. NodeJS
2. Express
3. AWS Lambda (deployment)
4. AWS SAM

Running the app suite.
    Prerequisites:
            Setup an AWS account
            Setup an Okta tenant as SPA.  Be sure to add your Sign-in redirect URIs and Sign-out redirect URIs to the domain and port of your React App, example:
                Sign-in:  http://localhost:3000/login/callback
                Sign-out: http://localhost:3000
            Setup a Domo account and configure one or more dashboards for private embed.  
            Ensure you have SAM installed and configured: https://aws.amazon.com/serverless/sam/
            Set your AWS CLI configuration:  https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html
            Set AWS Secrets Manager values for environment variables in both App and Server.  See the TEMPLATE.env in environment folders for the variables that must be set to run App and Server.  Include Secrets for your Github repo for CD / CI pipeline automation.   Note that local testing is supported with a local.env file

React App:
    Local:  
    run 
        npm install from /opsvision-domo-dashboard/
        create a local.env file in ./opsvision-domo-dashboard/environment using TEMPLATE.env to create required environment variables.  Remember to exclude this in your .gitignore file.
        run npm run start-local
    
    AWS CD/CI
        create a CloudFormation stack with the /opsvision-domo-dashboard/infrastructure/cloudformation_app.yml config.   This will create a CD / CI pipeline and deployment to S3/CloudFront.

Install the Server application to complete the setup of the application suite:  https://github.com/mitchellsjohnson/opsvision-domo-dashboards-server