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

export function groth16_verifier(inputs: string, proof: string, verificationKey: string): Promise<boolean> {
  return Rapidsnark.groth16_verify(inputs, proof, verificationKey);
}

export function calculate_public_buffer_size(zkey: string): Promise<number> {
  return Rapidsnark.calculate_public_buffer_size(zkey);
}
