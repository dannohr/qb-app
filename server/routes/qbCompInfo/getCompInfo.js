var config = require('../../config.json');
import quickBooks from 'node-quickbooks';

import { success, failure } from "../../libs/response-lib";

exports.main = (event, context, callback) => {

    var ids = {
        clientID: event.queryStringParameters.a,
        clientSecret: event.queryStringParameters.b,
        access_token: event.queryStringParameters.c,
        realmId: event.queryStringParameters.d,
        useSandbox: event.queryStringParameters.e,
        refresh_token: event.queryStringParameters.f

    }

    var qbo = new quickBooks(
        ids.clientId,
        ids.clientSecret,
        ids.access_token,         /* oAuth access token */
        false,                      /* no token secret for oAuth 2.0 */
        ids.realmId,
        ids.useSandbox,           /* use a sandbox account */
        true,                       /* turn debugging on */
        4,                          /* minor version */
        '2.0',                      /* oauth version */
        ids.refresh_token         /* refresh token */
    );

    // console.log(qbo)
    // callback(null, success(qbo));

    qbo.getCompanyInfo(ids.realmId, function (err, companyInfo) {
        if (err) {
            console.log(err);
            callback(null, failure({ status: err }));
        }
        else {
            console.log("The response is :" + JSON.stringify(companyInfo, null, 2));
            let compInfo = JSON.stringify(companyInfo, null, 2)
            console.log(compInfo)
            callback(null, success(compInfo));
        }
    });

};