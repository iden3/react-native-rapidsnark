"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_PROOF_BUFFER_SIZE = exports.DEFAULT_ERROR_BUFFER_SIZE = void 0;
exports.groth16Prove = groth16Prove;
exports.groth16PublicBufferSize = groth16PublicBufferSize;
exports.groth16Verify = groth16Verify;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'react-native-rapidsnark' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const RapidsnarkModule = isTurboModuleEnabled ? require('./NativeRapidsnark').default : _reactNative.NativeModules.Rapidsnark;
const Rapidsnark = RapidsnarkModule ? RapidsnarkModule : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const DEFAULT_PROOF_BUFFER_SIZE = exports.DEFAULT_PROOF_BUFFER_SIZE = 1024;
const DEFAULT_ERROR_BUFFER_SIZE = exports.DEFAULT_ERROR_BUFFER_SIZE = 256;
async function groth16Prove(zkeyPath, witness, {
  proofBufferSize,
  publicBufferSize,
  errorBufferSize
} = {
  proofBufferSize: DEFAULT_PROOF_BUFFER_SIZE,
  publicBufferSize: undefined,
  errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE
}) {
  let proof_buffer_size = proofBufferSize ?? DEFAULT_PROOF_BUFFER_SIZE;
  let public_buffer_size;
  let error_buffer_size = errorBufferSize ?? DEFAULT_ERROR_BUFFER_SIZE;
  if (!publicBufferSize) {
    public_buffer_size = await groth16PublicBufferSize(zkeyPath);
  } else {
    public_buffer_size = publicBufferSize;
  }
  return Rapidsnark.groth16Prove(zkeyPath, witness, proof_buffer_size, public_buffer_size, error_buffer_size);
}
function groth16Verify(proof, inputs, verificationKey, {
  errorBufferSize
} = {
  errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE
}) {
  let error_buffer_size = errorBufferSize ?? DEFAULT_ERROR_BUFFER_SIZE;
  return Rapidsnark.groth16Verify(proof, inputs, verificationKey, error_buffer_size);
}
function groth16PublicBufferSize(zkeyPath, {
  errorBufferSize
} = {
  errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE
}) {
  let error_buffer_size = errorBufferSize ?? DEFAULT_ERROR_BUFFER_SIZE;
  return Rapidsnark.groth16PublicBufferSize(zkeyPath, error_buffer_size);
}
//# sourceMappingURL=index.js.map