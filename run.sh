#!/bin/sh
#
# Use this script to run your program LOCALLY.

set -e # Exit early if any commands fail

# if you want you can edit it

exec bun run "$(dirname "$0")/app/main.ts" "$@"
