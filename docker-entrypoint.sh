#!/bin/bash

set -euo pipefail
set -x

LEDGER_HOST=localhost
LEDGER_PORT=9000
JSON_API_HTTP_PORT=7575

daml sandbox --max-ttl-seconds=120 --wall-clock-time --ledgerid=default-ledgerid --port 9000 &

sleep 5
until nc -z $LEDGER_HOST $LEDGER_PORT; do
  echo "Waiting for sandbox."
  sleep 1
done
echo "Connected to sandbox."

daml ledger upload-dar --host $LEDGER_HOST --port $LEDGER_PORT

service nginx start

daml json-api --ledger-host $LEDGER_HOST --ledger-port $LEDGER_PORT --http-port 7575 --max-inbound-message-size 4194304 --package-reload-interval 5s --application-id HTTP-JSON-API-Gateway
