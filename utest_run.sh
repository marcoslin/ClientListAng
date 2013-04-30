#!/bin/bash

# Do a single run for both unit and e2e tests
cd utest


unit_run.sh --single-run
if [ $? -ne 0 ]; then
	echo "### Unit test failed."
	exit 1
fi

echo ""
e2e_run.sh --single-run
if [ $? -ne 0 ]; then
	echo "### End-to-end test failed."
	exit 1
fi
