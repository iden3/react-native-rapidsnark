"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_PROOF_BUFFER_SIZE = exports.DEFAULT_ERROR_BUFFER_SIZE = void 0;
exports.groth16Prove = groth16Prove;
exports.groth16ProveWithZKeyFilePath = groth16ProveWithZKeyFilePath;
exports.groth16PublicSizeForZkeyFile = groth16PublicSizeForZkeyFile;
exports.groth16Verify = groth16Verify;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'react-native-rapidsnark' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const Rapidsnark = _reactNative.NativeModules.Rapidsnark ? _reactNative.NativeModules.Rapidsnark : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const DEFAULT_PROOF_BUFFER_SIZE = exports.DEFAULT_PROOF_BUFFER_SIZE = 1024;
const DEFAULT_ERROR_BUFFER_SIZE = exports.DEFAULT_ERROR_BUFFER_SIZE = 256;
async function groth16Prove(zkey, witness, {
  proofBufferSize = DEFAULT_PROOF_BUFFER_SIZE,
  publicBufferSize,
  errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE
} = {
  proofBufferSize: DEFAULT_PROOF_BUFFER_SIZE,
  publicBufferSize: undefined,
  errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE
}) {
  let public_buffer_size;
  if (!publicBufferSize) {
    public_buffer_size = await groth16PublicSizeForZkeyBuf(zkey);
  } else {
    public_buffer_size = proofBufferSize;
  }
  return Rapidsnark.groth16Prove(zkey, witness, proofBufferSize, public_buffer_size, errorBufferSize);
}
async function groth16ProveWithZKeyFilePath(zkey_path, witness, {
  proofBufferSize = DEFAULT_PROOF_BUFFER_SIZE,
  publicBufferSize,
  errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE
} = {
  proofBufferSize: DEFAULT_PROOF_BUFFER_SIZE,
  publicBufferSize: undefined,
  errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE
}) {
  let public_buffer_size;
  if (!publicBufferSize) {
    public_buffer_size = await groth16PublicSizeForZkeyFile(zkey_path);
  } else {
    public_buffer_size = proofBufferSize;
  }
  return Rapidsnark.groth16ProveWithZKeyFilePath(zkey_path, witness, proofBufferSize, public_buffer_size, errorBufferSize);
}
function groth16Verify(proof, inputs, verificationKey, {
  errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE
} = {
  errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE
}) {
  return Rapidsnark.groth16Verify(proof, inputs, verificationKey, errorBufferSize);
}
function groth16PublicSizeForZkeyBuf(zkey, {
  errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE
} = {
  errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE
}) {
  return Rapidsnark.groth16PublicSizeForZkeyBuf(zkey, errorBufferSize);
}
function groth16PublicSizeForZkeyFile(zkeyPath, {
  errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE
} = {
  errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE
}) {
  return Rapidsnark.groth16PublicSizeForZkeyFile(zkeyPath, errorBufferSize);
}
//# sourceMappingURL=index.js.map