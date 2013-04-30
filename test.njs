#!/usr/bin/env node

var events = require("events");
var util = require("util");

Setupdb = function(path) {
	events.EventEmitter(this);
	this.path = path;
	var self = this;
	
	this.init = function() {
		console.log("Sleeping for 2 seconds");
		setTimeout((function() {
			self.emit("dbdone", "This is the data string");
		}),2000);
	}
}
util.inherits(Setupdb, events.EventEmitter);


// Setup
var setupdb = new Setupdb();

setupdb.on("dbdone", function(data) {
	console.log("dbdone event received.");
	console.log("data: ", data);
});

console.log("### Calling setupdb.init");
setupdb.init();
console.log("### End of code.");
