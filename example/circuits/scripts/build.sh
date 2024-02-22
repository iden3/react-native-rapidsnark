echo "Compile test circuit"
echo "--------------------"

PTAU=powersOfTau28_hez_final_20.ptau
INPUTS=$(pwd)/../circuits/input.json

DIST="$(pwd)/../dist"

mkdir -p $DIST
if [ ! -f $DIST/$PTAU ]; then
    echo "Download power of tau...."
    wget https://hermez.s3-eu-west-1.amazonaws.com/$PTAU --directory-prefix ../dist/
    echo "Download finished"
else
    echo "Powers of tau file already downloaded... skip"
fi

pwd

echo "--------------------"
echo "compiling circuit"

time circom ../circuit.circom --r1cs --sym --wasm --c --output ../dist

snarkjs r1cs info $DIST/circuit.r1cs

echo "--------------------"
echo "building zkey"

yarn snarkjs groth16 setup $DIST/circuit.r1cs $DIST/$PTAU $DIST/circuit.zkey

ENTROPY1=$(head -c 64 /dev/urandom | od -An -tx1 -v | tr -d ' \n')
time snarkjs zkey contribute $DIST/circuit.zkey $DIST/circuit_final.zkey -v -e="$ENTROPY1"

echo "--------------------"
echo "building verification key"

time snarkjs zkey export verificationkey $DIST/circuit_final.zkey $DIST/verification_key.json

time snarkjs zkey export solidityverifier $DIST/circuit_final.zkey $DIST/Verifier.sol


echo "--------------------"
echo "generate wtns"



if [ -f $INPUTS ]; then
  CIRCUIT_PATH_JS=$DIST/circuit_js

  time node $CIRCUIT_PATH_JS/generate_witness.js $CIRCUIT_PATH_JS/circuit.wasm $INPUTS $CIRCUIT_PATH_JS/witness.wtns

  time snarkjs groth16 prove $DIST/circuit_final.zkey $CIRCUIT_PATH_JS/witness.wtns $CIRCUIT_PATH_JS/proof.json $CIRCUIT_PATH_JS/public.json

  snarkjs groth16 verify $DIST/verification_key.json $CIRCUIT_PATH_JS/public.json $CIRCUIT_PATH_JS/proof.json
else
    echo "Test data is not available... skip"
fi



echo "--------------------"
echo "Finish"
echo "--------------------"
