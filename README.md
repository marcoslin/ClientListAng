# ClientListAng
**ClientListAng** is a sample application written with node.js and angularjs.

The primary purpose is to illustrate how to:

1. Create a RESTFUL server in node.js  
2. Create a simple HTML5 app using RESTFUL  
3. Perform unit and end-to-end tes  

# How To Run
Start the web and RESTFul server by:  
`node server.njs`

Open your HTML5 browser and go to:  
<http://localhost:8080>

To run unit and e2e test, shutdown the server and run:  
`utest_run.sh`

# Requirements:

## Node.js
You must install `node`, and then using the included `npm` command to install
required packages.

1. [node.js](http://nodejs.org/) >= 0.10.4  
1. [express.js](http://expressjs.com/) >= 3.2.0  
1. [step.js](https://github.com/creationix/step) >= 0.0.5  
1. [sqlite3](https://github.com/developmentseed/node-sqlite3) >= 2.1.7
1. [karma-runner](http://karma-runner.github.io/) >= 0.8.5

## angular.js
Following packages is installed under www/components directory:

1. [angular.js](http://angularjs.org/) >= 1.0.6  
1. [angular-resource](http://docs.angularjs.org/api/ngResource.$resource) >= 1.0.6  
1. [angular-ui-bootstrap](http://angular-ui.github.io/bootstrap/) >= 0.3.0

Note: installed verison of `angular-ui-bootstrap` is a custom build with only `Alert` and `Dialog` 
      services
	  
Following was installed under www/css directory:

1. [Twitter Bootstrap](http://twitter.github.io/bootstrap/)

