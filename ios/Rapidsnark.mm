#import "Rapidsnark.h"

#import <React/RCTLog.h>
#import "RapidsnarkFramework.h"

@implementation Rapidsnark
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(groth16_prover:(nonnull NSString *)zkeyBytes1
                  witnessData:(nonnull NSString *)wtnsBytes1
                  proofBufferSize:(nonnull NSNumber *)proofBufferSize
                  publicBufferSize:(nonnull NSNumber *)publicBufferSize
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"groth16_prover called");
    // TODO: we should accept just the bytes as input, not base64 encoded strings
    // NSData decode base64
    NSData* zkeyBytes = [[NSData alloc]initWithBase64EncodedString:zkeyBytes1 options:0];
    NSData* wtnsBytes = [[NSData alloc]initWithBase64EncodedString:wtnsBytes1 options:0];

    const void *zkey_buffer = [zkeyBytes bytes];
    unsigned long zkey_size = [zkeyBytes length];

    const void *wtns_buffer = [wtnsBytes bytes];
    unsigned long wtns_size = [wtnsBytes length];

    unsigned long proof_size = (unsigned long) [proofBufferSize intValue];
    char proof_buffer[proof_size];

    unsigned long public_buffer_size = (unsigned long) [publicBufferSize intValue];
    char public_buffer[public_buffer_size];

    unsigned long error_msg_maxsize = (unsigned long) [errBufferSize intValue];
    char error_msg[error_msg_maxsize];

    RCTLogInfo(@"groth16_prover prove start");
    int statusCode = groth16_prover(
      zkey_buffer, zkey_size,
      wtns_buffer, wtns_size,
      proof_buffer, &proof_size,
      public_buffer, &public_buffer_size,
      error_msg, error_msg_maxsize
    );
    RCTLogInfo(@"groth16_prover prove end, status code %i", statusCode);

    if (statusCode != PROVER_OK) {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogInfo(@"Error:%@", errorString);
      reject([NSString stringWithFormat:@"%d", statusCode], errorString, nil);
      return;
    }

    NSString *proofResult = [NSString stringWithCString:proof_buffer encoding:NSUTF8StringEncoding];
    NSString *publicResult = [NSString stringWithCString:public_buffer encoding:NSUTF8StringEncoding];

    if (proofResult.length > 0) {
      NSDictionary *resultDict = @{@"proof": proofResult, @"pub_signals": publicResult};
      resolve(resultDict);
    } else {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogInfo(@"Error:%@", errorString);

      reject([NSString stringWithFormat:@"%d", statusCode], errorString, nil);
    }
}

RCT_EXPORT_METHOD(groth16_prover_zkey_file:(nonnull NSString *)zkey_file_path
                  witnessData:(nonnull NSString *)wtnsBytes1
                  proofBufferSize:(nonnull NSNumber *)proofBufferSize
                  publicBufferSize:(nonnull NSNumber *)publicBufferSize
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"groth16_prover called");
    // TODO: we should accept just the bytes as input, not base64 encoded strings
    // NSData decode base64

    const char *file_path = [zkey_file_path UTF8String];

    NSData* wtnsBytes = [[NSData alloc]initWithBase64EncodedString:wtnsBytes1 options:0];

    const void *wtns_buffer = [wtnsBytes bytes];
    unsigned long wtns_size = [wtnsBytes length];

    unsigned long proof_size = (unsigned long) [proofBufferSize intValue];
    char proof_buffer[proof_size];

    unsigned long public_buffer_size = (unsigned long) [publicBufferSize intValue];
    char public_buffer[public_buffer_size];

    unsigned long error_msg_maxsize = (unsigned long) [errBufferSize intValue];
    char error_msg[error_msg_maxsize];

    RCTLogInfo(@"groth16_prover_zkey_file prove start");
    RCTLogInfo(@"%s", file_path);
    int statusCode = groth16_prover_zkey_file(
      file_path,
      wtns_buffer, wtns_size,
      proof_buffer, &proof_size,
      public_buffer, &public_buffer_size,
      error_msg, error_msg_maxsize
    );
    RCTLogInfo(@"groth16_prover_zkey_file prove end");

    if (statusCode != PROVER_OK) {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogInfo(@"Error:%@", errorString);
      reject([NSString stringWithFormat:@"%d", statusCode], errorString, nil);
      return;
    }

    NSString *proofResult = [NSString stringWithCString:proof_buffer encoding:NSUTF8StringEncoding];
    NSString *publicResult = [NSString stringWithCString:public_buffer encoding:NSUTF8StringEncoding];

    if (proofResult.length > 0) {
      NSDictionary *resultDict = @{@"proof": proofResult, @"pub_signals": publicResult};
      resolve(resultDict);
    } else {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogInfo(@"Error:%@", errorString);

      reject([NSString stringWithFormat:@"%d", statusCode], errorString, nil);
    }
}

RCT_EXPORT_METHOD(groth16_verify:(nonnull NSString *)inputs
        proof:(nonnull NSString *)proof
        verification_key:(nonnull NSString *)verification_key
        resolve:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"groth16_verify called");
    RCTLogInfo(@"inputs: %@", inputs);
    RCTLogInfo(@"proof: %@", proof);
    RCTLogInfo(@"verification_key: %@", verification_key);

    // Convert NSString to C-style strings
    const char *cInputs = [inputs UTF8String];
    const char *cProof = [proof UTF8String];
    const char *cVerificationKey = [verification_key UTF8String];

    // Call the Rust function
    bool result = groth16_verify(cInputs, cProof, cVerificationKey);

    if (result) {
        RCTLogInfo(@"Verified true");
        resolve(@(result));
    } else {
        RCTLogInfo(@"Verified false");
        reject(@"groth16_verify error", @"Verification failed", nil);
    }
}

RCT_EXPORT_METHOD(calculate_public_buffer_size:(nonnull NSString *)zkeyBytes1
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // NSData decode base64
    NSData* zkeyBytes = [[NSData alloc]initWithBase64EncodedString:zkeyBytes1 options:0];

    const void *zkey_buffer = [zkeyBytes bytes];
    unsigned long zkey_size = [zkeyBytes length];

    NSInteger public_buffer_size = (NSInteger) ((int) CalcPublicBufferSize(zkey_buffer, zkey_size));

    resolve(@(public_buffer_size));
}

@end
