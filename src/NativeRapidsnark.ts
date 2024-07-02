import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  groth16Prove: (
    zkey: string,
    witness: string,
    proofBufferSize: number,
    publicBufferSize: number,
    errorBufferSize: number
  ) => Promise<{ proof: string; pub_signals: string }>;
  groth16ProveWithZKeyFilePath: (
    zkey_path: string,
    witness: string,
    proofBufferSize: number,
    publicBufferSize: number,
    errorBufferSize: number
  ) => Promise<{ proof: string; pub_signals: string }>;
  groth16Verify: (
    proof: string,
    publicSignals: string,
    verificationKey: string,
    errorBufferSize: number
  ) => Promise<boolean>;
  groth16PublicSizeForZkeyBuf: (
    zkey: string,
    errorBufferSize: number
  ) => Promise<number>;
  groth16PublicSizeForZkeyFile: (
    zkeyPath: string,
    errorBufferSize: number
  ) => Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNRapidsnark');
