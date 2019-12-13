#!/bin/sh
echo "Building Production release and uploading to server..."
export ENVFILE=config/.env.production && cd android && ./gradlew assembleRelease
cd ..
mkdir dist 2>/dev/null 
mv android/app/build/outputs/apk/app-release.apk dist/Vnukovo3PoS.apk
scp dist/Vnukovo3PoS.apk freserve:pos/dist/Vnukovo3PoS.apk