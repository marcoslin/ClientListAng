#!/bin/bash

# Run the unit test.  Pass "--single-run" arg to this script to immediately exit after test.
echo "============================================="
echo "* START UNIT TEST"
source scripts/start_webserver.sh

karma start conf/karma.unit.conf.js $*
karma_ret=$?

source scripts/stop_webserver.sh

exit $karma_ret
