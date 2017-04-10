var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var env = process.env.NODE_ENV || 'development';

app = express();

var forceSsl = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};

if (env === 'production') {
  app.use(forceSsl);
}

app.use(serveStatic(__dirname));

var port = process.env.PORT || 5000;
app.listen(port);