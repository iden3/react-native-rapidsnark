import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  groth16Prove: (
    zkey: string,
    witness: string,
    proofBufferSize: number | null,
    publicBufferSize: number | null,
    errorBufferSize: number | null
  ) => Promise<{ proof: string; pub_signals: string }>;
  groth16ProveWithZKeyFilePath: (
    zkey_path: string,
    witness: string,
    proofBufferSize: number | null,
    publicBufferSize: number | null,
    errorBufferSize: number | null
  ) => Promise<{ proof: string; pub_signals: string }>;
  groth16Verify: (
    proof: string,
    publicSignals: string,
    verificationKey: string,
    errorBufferSize: number | null
  ) => Promise<boolean>;
  groth16PublicSizeForZkeyBuf: (
    zkey: string,
    errorBufferSize: number | null
  ) => Promise<number>;
  groth16PublicSizeForZkeyFile: (
    zkeyPath: string,
    errorBufferSize: number | null
  ) => Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNRapidsnark');
