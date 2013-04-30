// Karma configuration
// Generated on Wed Apr 24 2013 09:21:43 GMT+0200 (CEST)

// base path, that will be used to resolve files and exclude
basePath = '../../';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'www/components/angular/angular.js',
  'www/components/angular-resource/angular-resource.js',
  'www/components/angular-ui-bootstrap/ui-bootstrap-custom-0.3.0-SNAPSHOT.js',
  'www/js/app.js',
  'utest/components/angular-mocks/angular-mocks.js',
  'utest/unit/*.js'
];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];

// web server port
port = 9876;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - Firefox
// - Opera
// - Safari (only Mac)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

proxies = {
	'/': "http://localhost:8080/"
}

junitReport = {
	outputFile: 'test_out/e2e.xml',
	suit: 'e2e'
}
