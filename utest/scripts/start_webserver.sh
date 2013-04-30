# Sourced by *_run.sh script to start the web server if necessary
if [ -z "`netstat -anp tcp | grep 8080`" ]; then
	echo "### Starting web server in the unit test mode."
	../server.njs utest &
	webserver_pid=$!
	echo "### Web server started with pid $webserver_pid"
fi

