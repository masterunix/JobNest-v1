#!/bin/bash
export NODE_OPTIONS="--localstorage-file=/tmp/.localstorage"
exec node node_modules/react-scripts/scripts/start.js "$@"


