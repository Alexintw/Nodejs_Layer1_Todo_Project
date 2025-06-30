#!/usr/bin/env bash

BASE_URL="http://localhost:3001"

echo "🟢 测试 GET /chain"
curl -i "${BASE_URL}/chain"

echo
echo "🟢 测试 GET /mine"
curl -i "${BASE_URL}/mine"
