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

export const DEFAULT_PROOF_BUFFER_SIZE = 1024;
export const DEFAULT_ERROR_BUFFER_SIZE = 256;

export async function groth16_prover(
  zkey: string,
  witness: string,
  {
    proofBufferSize = DEFAULT_PROOF_BUFFER_SIZE,
    publicBufferSize,
    errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE,
  } = {
    proofBufferSize: DEFAULT_PROOF_BUFFER_SIZE,
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<{ proof: string; pub_signals: string }> {
  let public_buffer_size;
  if (!publicBufferSize) {
    public_buffer_size = await groth16_public_size_for_zkey_buf(zkey);
  } else {
    public_buffer_size = proofBufferSize;
  }

  return Rapidsnark.groth16_prover(
    zkey,
    witness,
    publicBufferSize,
    public_buffer_size,
    errorBufferSize
  );
}

export async function groth16_prover_zkey_file(
  zkey_path: string,
  witness: string,
  {
    proofBufferSize = DEFAULT_PROOF_BUFFER_SIZE,
    publicBufferSize,
    errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE,
  } = {
    proofBufferSize: DEFAULT_PROOF_BUFFER_SIZE,
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<{ proof: string; pub_signals: string }> {
  let public_buffer_size;
  if (!publicBufferSize) {
    public_buffer_size = await groth16_public_size_for_zkey_file(zkey_path);
  } else {
    public_buffer_size = proofBufferSize;
  }

  return Rapidsnark.groth16_prover_zkey_file(
    zkey_path,
    witness,
    proofBufferSize,
    public_buffer_size,
    errorBufferSize
  );
}

export function groth16_verifier(
  proof: string,
  inputs: string,
  verificationKey: string,
  {errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE} = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<boolean> {
  return Rapidsnark.groth16_verify(
    proof,
    inputs,
    verificationKey,
    errorBufferSize
  );
}

export function groth16_public_size_for_zkey_buf(
  zkey: string,
  {errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE} = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<number> {
  return Rapidsnark.groth16_public_size_for_zkey_buf(zkey, errorBufferSize);
}

export function groth16_public_size_for_zkey_file(
  zkeyPath: string,
  {errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE} = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<number> {
  return Rapidsnark.groth16_public_size_for_zkey_file(
    zkeyPath,
    errorBufferSize
  );
}
