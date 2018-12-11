#!/bin/bash

# This script exists so that all validation checks can be run in parallel with a single compound exit status

EXIT_STATUS=0
pylint server || EXIT_STATUS=$?
npm run lint || EXIT_STATUS=$?
exit $EXIT_STATUS
