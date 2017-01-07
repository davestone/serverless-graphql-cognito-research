import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

const pems = require('../jwks.json');

const COGNITO_ISS = 'https://cognito-idp.' + process.env.COGNITO_REGION + '.amazonaws.com/' + process.env.COGNITO_USER_POOL_ID;

//
module.exports.user = (event, context, callback) => {

  //
  if (typeof pems === 'undefined' || typeof pems.keys === 'undefined') {
    if (process.env.DEBUG === 'true') {
      console.log('AUTH: No PEMS');
    }
    return context.fail('Unauthorized');
  }

  // Get Token
  if (typeof event.authorizationToken === 'undefined') {
    if (process.env.DEBUG === 'true') {
      console.log('AUTH: No JWT token');
    }
    return context.fail('Unauthorized');
  }

  const split = event.authorizationToken.split('Bearer');
  if (split.length !== 2) {
    if (process.env.DEBUG === 'true') {
      console.log('AUTH: No JWT token in Bearer');
    }
    return context.fail('Unauthorized');
  }
  const token = split[1].trim();
  const decodedJwt = jwt.decode(token, { complete: true });

  // Fail if the token is not jwt
  if (!decodedJwt) {
    console.log('AUTH: Not a valid JWT token');
    return context.fail('Unauthorized');
  }

  // Fail if token is not from your User Pool
  if (decodedJwt.payload.iss !== COGNITO_ISS) {
    if (process.env.DEBUG === 'true') {
      console.log('AUTH: invalid issuer');
    }
    return context.fail('Unauthorized');
  }

  // Reject the jwt if it's not an 'Access Token'
  if (decodedJwt.payload.token_use !== 'access') {
    if (process.env.DEBUG === 'true') {
      console.log('AUTH: Not an access token');
    }
    return context.fail('Unauthorized');
  }

  // Get the kid from the token and retrieve corresponding PEM
  const pem = jwkToPem(pems.keys.filter(function(k, i) {
    if (k.kid === decodedJwt.header.kid) {
      return true;
    }
  })[0]);

  if (!pem) {
    if (process.env.DEBUG === 'true') {
      console.log('AUTH: No corresponding PEM');
    }
    return context.fail('Unauthorized');
  }

  // Verify the signature of the JWT token to ensure it's really
  // coming from your User Pool
  jwt.verify(token, pem, {
    algorithms: pem.alg,
    issuer: COGNITO_ISS
  }, function(err, payload) {
    if (err) {
      if (process.env.DEBUG === 'true') {
        console.log('AUTH: Invalid access token', err);
      }
      return context.fail('Unauthorized');
    }

    // Valid token. Generate the API Gateway policy for the user
    // Always generate the policy on value of 'sub' claim and not
    // for 'username' because username is reassignable sub is
    // UUID for a user which is never reassigned to another user.

    context.succeed({
      principalId: payload.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'execute-api:*',
          Effect: 'Allow',
          Resource: event.methodArn
        }]
      }
    });
  });
}