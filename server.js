

	
	/* Dependencies */

	var env = process.env.NODE_ENV || 'development';
	var path = require('path');

	var express = require('express');
	var serveStatic = require('serve-static');



	
	/* Server */


	// App
	
	app = express();


	// SSL

	var forceSsl = function (req, res, next) {
  	if (req.headers['x-forwarded-proto'] !== 'https') {
    	return res.redirect(['https://', req.get('Host'), req.url].join(''));
  	}
  	return next();
	};

	if (env === 'production') {
  	app.use(forceSsl);
	}


	// Statics

	app.use(serveStatic(__dirname));


	// Routing
	
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'index.html'));
	});


	// Listen

	var port = process.env.PORT || 5000;
	app.listen(port);