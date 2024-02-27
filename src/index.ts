import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-rapidsnark' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
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

export async function groth16Prove(
  zkey: string,
  witness: string,
  {
    proofBufferSize = DEFAULT_PROOF_BUFFER_SIZE,
    publicBufferSize,
    errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE,
  }: {
    proofBufferSize: number;
    publicBufferSize: number | undefined;
    errorBufferSize: number;
  } = {
    proofBufferSize: DEFAULT_PROOF_BUFFER_SIZE,
    publicBufferSize: undefined,
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<{ proof: string; pub_signals: string }> {
  let public_buffer_size;

  if (!publicBufferSize) {
    public_buffer_size = await groth16PublicSizeForZkeyBuf(zkey);
  } else {
    public_buffer_size = proofBufferSize;
  }

  return Rapidsnark.groth16Prove(
    zkey,
    witness,
    proofBufferSize,
    public_buffer_size,
    errorBufferSize
  );
}

export async function groth16ProveWithZKeyFilePath(
  zkey_path: string,
  witness: string,
  {
    proofBufferSize = DEFAULT_PROOF_BUFFER_SIZE,
    publicBufferSize,
    errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE,
  }: {
    proofBufferSize: number;
    publicBufferSize: number | undefined;
    errorBufferSize: number;
  } = {
    proofBufferSize: DEFAULT_PROOF_BUFFER_SIZE,
    publicBufferSize: undefined,
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<{ proof: string; pub_signals: string }> {
  let public_buffer_size: number;
  if (!publicBufferSize) {
    public_buffer_size = await groth16PublicSizeForZkeyFile(zkey_path);
  } else {
    public_buffer_size = proofBufferSize;
  }

  return Rapidsnark.groth16ProveWithZKeyFilePath(
    zkey_path,
    witness,
    proofBufferSize,
    public_buffer_size,
    errorBufferSize
  );
}

export function groth16Verify(
  proof: string,
  inputs: string,
  verificationKey: string,
  {
    errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE,
  }: {
    errorBufferSize: number;
  } = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<boolean> {
  return Rapidsnark.groth16Verify(
    proof,
    inputs,
    verificationKey,
    errorBufferSize
  );
}

function groth16PublicSizeForZkeyBuf(
  zkey: string,
  {
    errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE,
  }: {
    errorBufferSize: number;
  } = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<number> {
  return Rapidsnark.groth16PublicSizeForZkeyBuf(zkey, errorBufferSize);
}

export function groth16PublicSizeForZkeyFile(
  zkeyPath: string,
  {
    errorBufferSize = DEFAULT_ERROR_BUFFER_SIZE,
  }: {
    errorBufferSize: number;
  } = {
    errorBufferSize: DEFAULT_ERROR_BUFFER_SIZE,
  }
): Promise<number> {
  return Rapidsnark.groth16PublicSizeForZkeyFile(zkeyPath, errorBufferSize);
}
