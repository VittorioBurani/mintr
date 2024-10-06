SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
sed -i 's|base: "/"|base: "/mintr/"|g' "${SCRIPTPATH}/vite.config.js"
npm run build
cp ${SCRIPTPATH}/dist/index.html ${SCRIPTPATH}/dist/404.html
sed -i 's|base: "/mintr/"|base: "/"|g' "${SCRIPTPATH}/vite.config.js"
