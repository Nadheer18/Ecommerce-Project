#!/bin/sh
host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  echo "Waiting for MySQL at $host..."
  sleep 2
done

echo "MySQL is up! Starting backend..."
exec $cmd

