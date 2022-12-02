#! /bin/bash
echo "https://${CODESPACE_NAME}-3000.github.dev" > .env.development.local
echo "REACT_APP_VERSION=\$npm_package_version" >> .env.development.local
cp .env.development.local .env.production.local
