#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting eShop Services...${NC}"

# Kill any existing services on ports 6001 and 8080
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
lsof -i :6001 -t 2>/dev/null | xargs kill -9 2>/dev/null
lsof -i :8080 -t 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2

# Load environment variables from .env
export $(cat /home/nuwan/eshop/.env | grep -v '#' | xargs)

# Start Auth Service
echo -e "${YELLOW}Starting Auth Service on port 6001...${NC}"
cd /home/nuwan/eshop
node apps/auth-service/dist/main.js > /tmp/auth-service.log 2>&1 &
AUTH_PID=$!
echo "Auth Service PID: $AUTH_PID"

# Wait for Auth Service to start
sleep 3

# Start API Gateway
echo -e "${YELLOW}Starting API Gateway on port 8080...${NC}"
node apps/api-gateway/dist/main.js > /tmp/api-gateway.log 2>&1 &
GATEWAY_PID=$!
echo "API Gateway PID: $GATEWAY_PID"

# Wait for API Gateway to start
sleep 2

# Test connectivity
echo -e "${YELLOW}Testing services...${NC}"
if curl -s http://localhost:8080/gateway-health > /dev/null; then
    echo -e "${GREEN}✓ API Gateway is responding${NC}"
else
    echo -e "${RED}✗ API Gateway is not responding${NC}"
fi

if curl -s http://localhost:6001/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Auth Service is responding${NC}"
else
    echo -e "${RED}✗ Auth Service is not responding${NC}"
fi

echo -e "${GREEN}Services started!${NC}"
echo -e "${YELLOW}Auth Service logs: tail -f /tmp/auth-service.log${NC}"
echo -e "${YELLOW}API Gateway logs: tail -f /tmp/api-gateway.log${NC}"
