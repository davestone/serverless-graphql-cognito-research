import 'babel-polyfill'; // needed to for async/await

import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js';

//
module.exports.unauthenticated = (event, context, callback) => {

  /*
   * Serverless: will you eventually do this?
   */

  if (event.headers.Accept.indexOf('json') > -1) {
    event.body = JSON.parse(event.body);
  }

  /*
   * Cognito
   */

  var userPool = new CognitoUserPool({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID,
    region: process.env.COGNITO_REGION
  });

  /*
   * Routes
   */

  let routes = {
    POST: {},
    PATCH: {},
    DELETE: {}
  };

  // Register a User with the Application
  routes.POST['/users/accounts'] = function(event, context, callback) {
    userPool.signUp(event.body.username, event.body.password, [
      new CognitoUserAttribute({
        Name: 'email',
        Value: event.body.email
      })
    ], null, function(err, res) {
      if (err || res === null) {
        return context.succeed({
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': process.env.CORS_ACAO
          },
          body: JSON.stringify({
            errors: [err.message] || ['foo']
          })
        });
      }

      context.succeed({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.CORS_ACAO
        },
        body: JSON.stringify({
          username: res.user.username
        })
      });
    });
  };

  // Authenticate a User
  routes.POST['/users/sessions'] = function(event, context, callback) {
    var cognitoUser = new CognitoUser({
      Username: event.body.username,
      Pool: userPool
    });

    cognitoUser.authenticateUser(new AuthenticationDetails({
      Username: event.body.username,
      Password: event.body.password,
    }), {
      onSuccess: function(result) {
        const jwtToken = result.getAccessToken().getJwtToken();
        // when Federating User Pools
        // const jwtToken = result.idToken.jwtToken;

        context.succeed({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': process.env.CORS_ACAO
          },
          body: JSON.stringify({
            token: jwtToken
          })
        });
      },
      onFailure: function(err) {
        context.succeed({
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': process.env.CORS_ACAO
          },
          body: JSON.stringify({
            errors: [
              err
            ]
          })
        });
      },
    });
  };

  // TODO : Forgotten Password Flow, part 1
  routes.POST['/users/reset-passwords'] = function(event, context, callback) {
  };

  // TODO : Forgotten Password Flow, part 2
  routes.PATCH['/users/reset-passwords'] = function(event, context, callback) {
  };

  routes[event.httpMethod][event.resource](event, context, callback);
};

module.exports.authenticated = (event, context, callback) => {
  // // TODO : Delete an Authenticated User
  // routes.DELETE['/users/accounts'] = function(event, context, callback) {
  // }
  //
  // // TODO : Update Attributes
  // routes.PATCH['/users/accounts'] = function(event, context, callback) {
  // };
  //
  // // TODO : Resend a Confirmation Code
  // routes.POST['/users/verify'] = function(event, context, callback) {
  // };
  //
  // // TODO : Confirm Registration
  // routes.PATCH['/users/verify'] = function(event, context, callback) {
  // };
  //
  // // TODO : Change a Password
  // routes.PATCH['/users/passwords'] = function(event, context, callback) {
  // };
  //
  // // TODO : Sign a User Out
  // routes.DELETE['/users/sessions'] = function(event, context, callback) {
  // };
  //
  // routes[event.httpMethod][event.resource](event, context, callback);
}
