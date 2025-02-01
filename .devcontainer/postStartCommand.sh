#! /bin/bash
if [ ! -z ${GITPOD_HOST+x} ]; then
	ACCESS_URL="https://8100-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}"
elif [ ! -z ${CODESPACE_NAME+x} ]; then
	ACCESS_URL="https://${CODESPACE_NAME}-8100.preview.app.github.dev"
else
	ACCESS_URL="http://localhost:8100"
fi

echo "PUBLIC_URL=${ACCESS_URL}" > .env.development.local
echo "REACT_APP_VERSION=\$npm_package_version" >> .env.development.local
cp .env.development.local .env.production.local
