import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  groth16Prove: (
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
  groth16PublicBufferSize: (
    zkeyPath: string,
    errorBufferSize: number | null
  ) => Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Rapidsnark');
