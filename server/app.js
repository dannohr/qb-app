require('dotenv').config();
var https = require('https');
var express = require('express');
var session = require('express-session');
var request = require('request');
var app = express();
var config = require('./config.json');
var path = require('path');
var crypto = require('crypto');
var QuickBooks = require('node-quickbooks');
var queryString = require('query-string');
var fs = require('fs');
var json2csv = require('json2csv');
var Tokens = require('csrf');
var csrf = new Tokens();
var atob = require('atob');

// Configure View and Handleba redirect_urirs
app.use(express.static(path.join(__dirname, '')))
app.set('views', path.join(__dirname, 'views'))
var exphbs = require('express-handlebars');
var hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session({ secret: 'secret', resave: 'false', saveUninitialized: 'false' }))

/*
Create body parsers for application/json and application/x-www-form-urlencoded
 */
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var urlencodedParser = bodyParser.urlencoded({ extended: false })

/*
App Variables
 */
var oauth2_token_json = null,
    realmId = '',
    accessToken = '',
    payload = '';
scope = '';
var fields = ['realmId', 'name', 'id', 'operation', 'lastUpdated'];
var newLine = "\r\n";


app.use(express.static('views'));

app.get('/', function (req, res) {

    // Render home page with params
    res.render('index', {
        redirect_uri: config.redirectUri,
        oauth2_token_json: oauth2_token_json
    });
});

app.get('/authUri', function (req, res) {

    // Generate csrf Anti Forgery 
    req.session.secret = csrf.secretSync();
    var state = csrf.create(req.session.secret);

    // Generate the AuthUrl
    var redirecturl = config.authorization_endpoint + '?' + queryString.stringify({
        'client_id': config.clientId,
        'redirect_uri': config.redirectUri,  //Make sure this path matches entry in application dashboard
        'scope': config.scopes.connect_to_quickbooks[0] + ' ' + config.scopes.connect_to_quickbooks[1] + ' ' + config.scopes.sign_in_with_intuit[0] + ' ' + config.scopes.sign_in_with_intuit[1] + ' ' + config.scopes.sign_in_with_intuit[2] + ' ' + config.scopes.sign_in_with_intuit[3] + ' ' + config.scopes.sign_in_with_intuit[4],
        'response_type': 'code',
        'state': state
    });
    res.send(redirecturl);
});

app.get('/callback', function (req, res) {

    var parsedUri = queryString.parse(req.originalUrl);
    realmId = parsedUri.realmId;

    var auth = (new Buffer(config.clientId + ':' + config.clientSecret).toString('base64'));
    var postBody = {
        url: config.token_endpoint,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + auth,
        },
        form: {
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: config.redirectUri
        }
    };

    request.post(postBody, function (err, res, data) {
        accessToken = JSON.parse(res.body);
        oauth2_token_json = JSON.stringify(accessToken, null, 2);
        console.log('The access tokeb is :' + oauth2_token_json);
    });
    res.send('');
});

app.get('/refreshAccessToken', function (req, res) {

    // save the access token somewhere on behalf of the logged in user
    var qbo = new QuickBooks(config.clientId,
        config.clientSecret,
        accessToken.access_token, /* oAuth access token */
        false, /* no token secret for oAuth 2.0 */
        realmId,
        config.useSandbox, /* use a sandbox account */
        true, /* turn debugging on */
        4, /* minor version */
        '2.0', /* oauth version */
        accessToken.refresh_token /* refresh token */);

    qbo.refreshAccessToken(function (err, refreshToken) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            console.log("The response refresh is :" + JSON.stringify(refreshToken, null, 2));
            res.send(refreshToken);
        }
    });


});

app.get('/getCompanyInfo', function (req, res) {


    // save the access token somewhere on behalf of the logged in user
    var qbo = new QuickBooks(config.clientId,
        config.clientSecret,
        accessToken.access_token, /* oAuth access token */
        false, /* no token secret for oAuth 2.0 */
        realmId,
        config.useSandbox, /* use a sandbox account */
        true, /* turn debugging on */
        4, /* minor version */
        '2.0', /* oauth version */
        accessToken.refresh_token /* refresh token */);

    qbo.getCompanyInfo(realmId, function (err, companyInfo) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            console.log("The response is :" + JSON.stringify(companyInfo, null, 2));
            res.send(companyInfo);
        }
    });
});


// Start server on HTTP (will use ngrok for HTTPS forwarding)
app.listen(config.port, function () {
    console.log('Backend listening on port', config.port)
});