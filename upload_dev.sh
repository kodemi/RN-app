#!/bin/sh
echo "Building Dev release and uploading to server..."
export ENVFILE=config/.env.dev && cd android && ./gradlew assembleRelease
cd ..
mkdir dist 2>/dev/null
mv android/app/build/outputs/apk/app-release.apk dist/Vnukovo3PoS-dev.apk
scp dist/Vnukovo3PoS-dev.apk freserve:pos/dist/Vnukovo3PoS-dev.apk