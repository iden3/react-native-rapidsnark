echo "Copying zkey, verification key and witness files to example folder"

ANDROID_DIR=../../android/app/src/main/assets

DIST=$(pwd)/../dist
ZKEY=$DIST/circuit_final.zkey
VERIFICATION_KEY=$DIST/verification_key.json
WITNESS=$DIST/circuit_js/witness.wtns

if [[ ! -f $ANDROID_DIR ]]; then
  echo "created Android assets dir"
  mkdir -p ../../android/app/src/main/assets
fi

echo "--------------------"

if [[ -f $ZKEY ]]; then
  cp $ZKEY ../../
  cp $ZKEY ../../ios
  cp $ZKEY ../../android/app/src/main/assets
  echo "zkey copied"
else
  echo "zkey not found"
fi

echo "--------------------"

if [[ -f $VERIFICATION_KEY ]]; then
  cp $VERIFICATION_KEY ../../
  cp $VERIFICATION_KEY ../../ios
  cp $VERIFICATION_KEY ../../android/app/src/main/assets
  echo "verification key copied"
else
  echo "verification key not found"
fi

echo "--------------------"

if [[ -f $WITNESS ]]; then
  cp $WITNESS ../../
  cp $WITNESS ../../ios
  cp $WITNESS ../../android/app/src/main/assets
  echo "witness copied"
else
  echo "witness not found"
fi
