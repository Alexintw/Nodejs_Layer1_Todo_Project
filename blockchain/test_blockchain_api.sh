#!/usr/bin/env bash
BASE_URL="http://localhost:3001"
NODE_URL="http://localhost:3001"

echo "🟢 1. 新增交易 POST /transactions/new"
curl -i -X POST "${BASE_URL}/transactions/new" \
  -H "Content-Type: application/json" \
  -d '{
    "sender":    "alice",
    "recipient": "bob",
    "amount":     42
  }'
echo -e "\n"

echo "🟢 2. 注册节点 POST /nodes/register"
curl -i -X POST "${BASE_URL}/nodes/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"nodes\": [\"${NODE_URL}\",\"http://example.com:3001\"]
  }"
echo -e "\n"

echo "🟢 3. 共识算法 GET /nodes/resolve"
curl -i "${BASE_URL}/nodes/resolve"
echo -e "\n"
