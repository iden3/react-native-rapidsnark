import Foundation

import rapidsnark


@objc(RapidsnarkProxy)
public class RapidsnarkProxy : NSObject {
    @objc
    public static func groth16ProveProxy(
        zkey: NSData,
        witness: NSData,
        proofBufferSize: NSNumber,
        publicBufferSize: NSNumber,
        errBufferSize: NSNumber
    ) throws -> NSDictionary {
        do {
            let proof = try groth16Prove(
                zkey: zkey as Data,
                witness: witness as Data,
                proofBufferSize: proofBufferSize.intValue,
                publicBufferSize: publicBufferSize.intValue,
                errorBufferSize: errBufferSize.intValue
            )

            return [
                "proof": proof.proof,
                "pub_signals": proof.publicSignals
            ]
        } catch let error {
            throw error
        }
    }

    @objc
    public static func groth16ProveWithZkeyFilePathProxy(
        zkeyFilePath: NSString,
        witness: NSData,
        proofBufferSize: NSNumber,
        publicBufferSize: NSNumber,
        errBufferSize: NSNumber
    ) throws -> NSDictionary {
        do {
            let proof = try groth16ProveWithZKeyFilePath(
                zkeyPath: zkeyFilePath as String,
                witness: witness as Data,
                proofBufferSize: proofBufferSize.intValue,
                publicBufferSize: publicBufferSize.intValue,
                errorBufferSize: errBufferSize.intValue
            )

            return [
                "proof": proof.proof,
                "pub_signals": proof.publicSignals
            ]
        } catch let error {
            throw error
        }
    }

    @objc
    public static func groth16VerifyProxy(
        proof: NSString,
        inputs: NSString,
        verificationKey: NSString,
        errorBufferSize: NSNumber
    ) throws -> NSNumber {
        do {
            let result: Bool = try groth16Verify(
                proof: (proof as String).data(using: .utf8)!,
                inputs: (inputs as String).data(using: .utf8)!,
                verificationKey: (verificationKey as String).data(using: .utf8)!,
                errorBufferSize: errorBufferSize.intValue
            )
            if (result) {
                return 0
            } else {
                return 1
            }
        } catch let error {
            throw error
        }
    }

    @objc
    public static func groth16PublicSizeForZkeyBufProxy(
        zkey: NSData,
        errorBufferSize: NSNumber
    ) throws -> NSNumber {
        do {
            let publicBufferSize: Int = try groth16PublicSizeForZkeyBuf(
                zkey: zkey as Data,
                errorBufferSize: errorBufferSize.intValue
            )
            return NSNumber(value: publicBufferSize)
        } catch let error {
            throw error
        }
    }

    @objc
    public static func groth16PublicSizeForZkeyFileProxy(
        zkeyPath: NSString,
        errorBufferSize: NSNumber
    ) throws -> NSNumber {
        do {
            let publicBufferSize: Int = try groth16PublicSizeForZkeyFile(
                zkeyPath: zkeyPath as String,
                errorBufferSize: errorBufferSize.intValue
            )
            return NSNumber(value: publicBufferSize)
        } catch let error {
            throw error
        }
    }
}
