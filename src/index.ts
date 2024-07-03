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
  : NativeModules.RNRapidsnark;

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
  zkey: string,
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
    public_buffer_size = await groth16PublicSizeForZkeyBuf(zkey);
  } else {
    public_buffer_size = publicBufferSize;
  }

  return Rapidsnark.groth16Prove(
    zkey,
    witness,
    proof_buffer_size,
    public_buffer_size,
    error_buffer_size
  );
}

export async function groth16ProveWithZKeyFilePath(
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
    public_buffer_size = await groth16PublicSizeForZkeyFile(zkeyPath);
  } else {
    public_buffer_size = publicBufferSize;
  }

  return Rapidsnark.groth16ProveWithZKeyFilePath(
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

function groth16PublicSizeForZkeyBuf(
  zkey: string,
  {
    errorBufferSize,
  }: {
    errorBufferSize: number | undefined;
  } = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<number> {
  let error_buffer_size = errorBufferSize ?? DEFAULT_ERROR_BUFFER_SIZE;

  return Rapidsnark.groth16PublicSizeForZkeyBuf(zkey, error_buffer_size);
}

export function groth16PublicSizeForZkeyFile(
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

  return Rapidsnark.groth16PublicSizeForZkeyFile(zkeyPath, error_buffer_size);
}
