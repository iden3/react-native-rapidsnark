export declare const DEFAULT_PROOF_BUFFER_SIZE = 1024;
export declare const DEFAULT_ERROR_BUFFER_SIZE = 256;
export declare function groth16Prove(zkey: string, witness: string, { proofBufferSize, publicBufferSize, errorBufferSize, }?: {
    proofBufferSize: number;
    publicBufferSize: number | undefined;
    errorBufferSize: number;
}): Promise<{
    proof: string;
    pub_signals: string;
}>;
export declare function groth16ProveWithZKeyFilePath(zkey_path: string, witness: string, { proofBufferSize, publicBufferSize, errorBufferSize, }?: {
    proofBufferSize: number;
    publicBufferSize: number | undefined;
    errorBufferSize: number;
}): Promise<{
    proof: string;
    pub_signals: string;
}>;
export declare function groth16Verify(proof: string, inputs: string, verificationKey: string, { errorBufferSize, }?: {
    errorBufferSize: number;
}): Promise<boolean>;
export declare function groth16PublicSizeForZkeyFile(zkeyPath: string, { errorBufferSize, }?: {
    errorBufferSize: number;
}): Promise<number>;
//# sourceMappingURL=index.d.ts.map