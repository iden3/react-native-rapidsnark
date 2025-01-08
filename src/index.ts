import {NativeModules, Platform} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-rapidsnark' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const RapidsnarkModule = isTurboModuleEnabled
  ? require('./NativeRapidsnark').default
  : NativeModules.Rapidsnark;

const Rapidsnark = RapidsnarkModule
  ? RapidsnarkModule
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

export async function groth16Prove(
  zkeyPath: string,
  witness: string,
  {
    proofBufferSize,
    publicBufferSize,
    errorBufferSize,
  }: {
    proofBufferSize?: number;
    publicBufferSize?: number | undefined;
    errorBufferSize?: number;
  } = {
    proofBufferSize: DEFAULT_PROOF_BUFFER_SIZE,
    publicBufferSize: undefined,
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<{ proof: string; pub_signals: string }> {
  let proof_buffer_size = proofBufferSize ?? DEFAULT_PROOF_BUFFER_SIZE;
  let public_buffer_size: number;
  let error_buffer_size = errorBufferSize ?? DEFAULT_ERROR_BUFFER_SIZE;

  if (!publicBufferSize) {
    public_buffer_size = await groth16PublicBufferSize(zkeyPath);
  } else {
    public_buffer_size = publicBufferSize;
  }

  return Rapidsnark.groth16Prove(
    zkeyPath,
    witness,
    proof_buffer_size,
    public_buffer_size,
    error_buffer_size
  );
}

export function groth16Verify(
  proof: string,
  inputs: string,
  verificationKey: string,
  {
    errorBufferSize,
  }: {
    errorBufferSize: number | undefined;
  } = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<boolean> {
  let error_buffer_size = errorBufferSize ?? DEFAULT_ERROR_BUFFER_SIZE;

  return Rapidsnark.groth16Verify(
    proof,
    inputs,
    verificationKey,
    error_buffer_size
  );
}

export function groth16PublicBufferSize(
  zkeyPath: string,
  {
    errorBufferSize,
  }: {
    errorBufferSize: number | undefined;
  } = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<number> {
  let error_buffer_size = errorBufferSize ?? DEFAULT_ERROR_BUFFER_SIZE;

  return Rapidsnark.groth16PublicBufferSize(zkeyPath, error_buffer_size);
}
