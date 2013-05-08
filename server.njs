#!/usr/bin/env node

/*jslint vars: true, node: true */

var fs = require('fs');
var express = require('express');
var nosqlite = require("nosqlite");
var app = express();

// Declare configuration variables
var db_file = __dirname + "/data/sqlite.db";
console.log("db_file " + db_file);
var http_port = 8080;

// Process Command Line Args
var unit_test_mode = false;
process.argv.forEach( function (val, index, array) {
	// Skip the first 2 indexes
	if ( index > 1  && val == "utest" && fs.existsSync(db_file) ) {
		console.log('utest param detected.  Removing ' + db_file);
		fs.unlinkSync(db_file);
		unit_test_mode = true;
	};
});

// Declare DB
var db = nosqlite(db_file);

// Configure Web Server
app.use(express.bodyParser());

// Special unit test config

if ( unit_test_mode ) {
    app.get('/reloadb/utest', function (req, res) {
        fs.unlinkSync(db_file);
        db.initialize( function () {
            res.send('<div id="status_text">Database reloaded.</div>');
        });
    });
} else {
	// Don't use detail logging on unit test mode
	app.use(express.logger());
};

// Configure static file server
app.use(express.static(__dirname + '/www'));
app.use("/utest", express.static(__dirname + '/utest'));

// Configure json restful service
app.get('/json', db.find_all);
app.post('/json', db.insert);
app.get('/json/:id', db.find_one);
app.put('/json/:id', db.update);
app.delete('/json/:id', db.remove);

// Initialize database and start the webserver when database is ready
db.initialize( function () {
    app.listen(http_port);
    console.log("Express server listening on port " + http_port);
});
