import {NativeModules, Platform} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-rapidsnark' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Rapidsnark = NativeModules.Rapidsnark
  ? NativeModules.Rapidsnark
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export function groth16_prover(zkey: string, witness: string, {
  proofBufferSize = 16384,
  publicBufferSize = 16384,
  errorBufferSize = 256
} = {
  proofBufferSize: 16384,
  publicBufferSize: 16384,
  errorBufferSize: 256,
}): Promise<{ proof: string, pub_signals: string }> {
  return Rapidsnark.groth16_prover(zkey, witness, proofBufferSize, publicBufferSize, errorBufferSize);
}

export function groth16_prover_zkey_file(zkey_path: string, witness: string, {
  proofBufferSize = 16384,
  publicBufferSize = 16384,
  errorBufferSize = 256,
} = {
  proofBufferSize: 16384,
  publicBufferSize: 16384,
  errorBufferSize: 256,
}): Promise<{ proof: string, pub_signals: string }> {
  return Rapidsnark.groth16_prover_zkey_file(zkey_path, witness, proofBufferSize, publicBufferSize, errorBufferSize);
}

export function groth16_verifier(proof: string, inputs: string, verificationKey: string, {
  errorBufferSize = 256,
} = {
  errorBufferSize: 256,
}): Promise<boolean> {
  return Rapidsnark.groth16_verify(proof, inputs, verificationKey, errorBufferSize);
}

export function groth16_public_size_for_zkey_buf(zkey: string, {
  errorBufferSize = 256,
} = {
  errorBufferSize: 256,
}): Promise<number> {
  return Rapidsnark.groth16_public_size_for_zkey_buf(zkey, errorBufferSize);
}

export function groth16_public_size_for_zkey_file(zkeyPath: string, {
  errorBufferSize = 256,
} = {
  errorBufferSize: 256,
}): Promise<number> {
  return Rapidsnark.groth16_public_size_for_zkey_file(zkeyPath, errorBufferSize);
}
