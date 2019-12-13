#!/bin/sh
daml start \
  --open-browser=no \
  --start-navigator=no \
  --sandbox-option='--max-ttl-seconds=120' \
  --sandbox-option=--wall-clock-time \
  --sandbox-option='--ledgerid=default-ledgerid' \
  $*
