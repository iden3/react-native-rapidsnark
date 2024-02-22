echo "Copying zkey, verification key and witness files to example folder"

DIST=$(pwd)/../dist
ZKEY=$DIST/circuit_final.zkey
VERIFICATION_KEY=$DIST/verification_key.json
WITNESS=$DIST/circuit_js/witness.wtns

echo "--------------------"

if [[ -f $ZKEY ]]; then
  cp $ZKEY ../../circuit.zkey
  cp $ZKEY ../../ios/circuit.zkey
  cp $ZKEY ../../android/app/src/main/assets/circuit.zkey
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
