import uuid from "uuid";
// var config = require('../../config.json');
// var queryString = require('query-string');
import request from "request";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context, callback) {

    // accessToken = JSON.parse(event.body);
    // oauth2_token_json = JSON.stringify(accessToken, null, 2);
    let bodyObj = (JSON.parse(event.body))
    // console.log('uri is ' + bodyObj.url)
    // console.log(bodyObj);
    // console.log(event.body)

    request.post(bodyObj, function (err, res, data) {
        // let accessToken = JSON.parse(res.body);
        // let oauth2_token_json = JSON.stringify(accessToken, null, 2);
        // console.log(err)
        // console.log(res)
        // console.log(data)
        // console.log('The access token is :' + oauth2_token_json);
        // // callback(null, success(oauth2_token_json));
        callback(null, success(res.body));
    })

    // callback(null, success(test));




};