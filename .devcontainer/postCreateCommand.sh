#! /bin/bash
docker-compose -f .github/docker-compose.yml pull
docker-compose -f .github/docker-compose.yml build
npm ci
