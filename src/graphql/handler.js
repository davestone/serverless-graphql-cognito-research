import 'babel-polyfill'; // needed to for async/await
import { graphql } from 'graphql';
import Schema from './schema';

import { CognitoUserPool } from 'amazon-cognito-identity-js';

module.exports.graphql = (event, context, callback) => {

  /*
   * Serverless: will you eventually do this?
   */

  if (event.headers.Accept.indexOf('json') > -1) {
    event.body = JSON.parse(event.body);
  }

  /*
   * Client Input
   */

  const { query, variables } = event.body;
  if (process.env.DEBUG === 'true') {
    console.log('GRAPHQL query', query);
    console.log('GRAPHQL variables', variables);
  }

  //
  const userPool = new CognitoUserPool({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID,
    region: process.env.COGNITO_REGION
  });

  /*
   * OK QL, do your thing...
   */

  graphql(Schema, query, {
    currentUser: userPool.getCurrentUser()
  }, variables)
    .then(function(res) {
      context.succeed({
        statusCode: res.errors ? 400 : 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.CORS_ACAO
        },
        body: JSON.stringify(res)
      });
    });
}
