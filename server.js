var fs = require('fs');
var path = require('path');
var https = require('https');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');

var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

// serve static files
app.use(express.static('./'));

// init local server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000);