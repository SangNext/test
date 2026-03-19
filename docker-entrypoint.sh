#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy 2>/dev/null || echo "Migration skipped (first run or already up to date)"

echo "Starting Next.js server..."
exec node server.js
