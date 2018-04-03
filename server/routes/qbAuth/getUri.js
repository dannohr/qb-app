var config = require('../../config.json');
var queryString = require('query-string');
var Tokens = require('csrf');
var csrf = new Tokens();

import { success, failure } from "../../libs/response-lib";

exports.main = (event, context, callback) => {

    // Generate csrf Anti Forgery 
    event.requestContext.identity.cognitoIdentityId = csrf.secretSync();
    var state = csrf.create(event.requestContext.identity.cognitoIdentityId);

    // Originally the above was this, but not sure how to deal with
    // sessions when using Serverless
    // req.session.secret = csrf.secretSync();
    // var state = csrf.create(req.session.secret);

    // Generate the AuthUrl
    var redirecturl = config.authorization_endpoint + '?' + queryString.stringify({
        'client_id': config.clientId,
        'redirect_uri': config.redirectUri,  //Make sure this path matches entry in application dashboard
        'scope': config.scopes.connect_to_quickbooks[0] + ' ' + config.scopes.connect_to_quickbooks[1] + ' ' + config.scopes.sign_in_with_intuit[0] + ' ' + config.scopes.sign_in_with_intuit[1] + ' ' + config.scopes.sign_in_with_intuit[2] + ' ' + config.scopes.sign_in_with_intuit[3] + ' ' + config.scopes.sign_in_with_intuit[4],
        'response_type': 'code',
        'state': state
    });

    callback(null, success(redirecturl));
};