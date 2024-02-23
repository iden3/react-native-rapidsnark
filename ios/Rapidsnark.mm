#import "Rapidsnark.h"

#import <React/RCTLog.h>
#import "RapidsnarkFramework.h"

@implementation Rapidsnark
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(groth16Prove:(nonnull NSString *)zkeyBytes1
                  witnessData:(nonnull NSString *)wtnsBytes1
                  proofBufferSize:(nonnull NSNumber *)proofBufferSize
                  publicBufferSize:(nonnull NSNumber *)publicBufferSize
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
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

    int statusCode = groth16_prover(
      zkey_buffer, zkey_size,
      wtns_buffer, wtns_size,
      proof_buffer, &proof_size,
      public_buffer, &public_buffer_size,
      error_msg, error_msg_maxsize
    );

    if (statusCode != PROVER_OK) {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogError(@"Error:%@", errorString);
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
      RCTLogError(@"Error:%@", errorString);

      reject([NSString stringWithFormat:@"%d", statusCode], errorString, nil);
    }
}

RCT_EXPORT_METHOD(groth16ProveWithZKeyFilePath:(nonnull NSString *)zkey_file_path
                  witnessData:(nonnull NSString *)wtnsBytes1
                  proofBufferSize:(nonnull NSNumber *)proofBufferSize
                  publicBufferSize:(nonnull NSNumber *)publicBufferSize
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
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

    int statusCode = groth16_prover_zkey_file(
      file_path,
      wtns_buffer, wtns_size,
      proof_buffer, &proof_size,
      public_buffer, &public_buffer_size,
      error_msg, error_msg_maxsize
    );

    if (statusCode != PROVER_OK) {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogError(@"Error:%@", errorString);
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

RCT_EXPORT_METHOD(groth16Verify:(nonnull NSString *)proof
        inputs:(nonnull NSString *)inputs
        verification_key:(nonnull NSString *)verification_key
        errBufferSize:(nonnull NSNumber *)errBufferSize
        resolve:(RCTPromiseResolveBlock)resolve
        reject:(RCTPromiseRejectBlock)reject)
{
    // Convert NSString to C-style strings
    const char *cProof = [proof UTF8String];
    const char *cInputs = [inputs UTF8String];
    const char *cVerificationKey = [verification_key UTF8String];

    unsigned long error_msg_maxsize = (unsigned long) [errBufferSize intValue];
    char error_msg[error_msg_maxsize];

    // Call the Rust function
    int result = groth16_verify(cProof, cInputs, cVerificationKey, error_msg, error_msg_maxsize);

    if (result != VERIFIER_ERROR) {
      bool proofValid = result == VERIFIER_VALID_PROOF;
      resolve(@(proofValid));
    } else {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogError(@"Error:%@", errorString);
      reject([NSString stringWithFormat:@"%d", result], errorString, nil);
    }
}

RCT_EXPORT_METHOD(groth16PublicSizeForZkeyBuf:(nonnull NSString *)zkeyBytes1
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // NSData decode base64
    NSData* zkeyBytes = [[NSData alloc]initWithBase64EncodedString:zkeyBytes1 options:0];

    const void *zkey_buffer = [zkeyBytes bytes];
    unsigned long zkey_size = [zkeyBytes length];

    unsigned long error_msg_maxsize = (unsigned long) [errBufferSize intValue];
    char error_msg[error_msg_maxsize];

    size_t public_buffer_size = 0;

    int status_code = groth16_public_size_for_zkey_buf(
      zkey_buffer, zkey_size,
      &public_buffer_size,
      error_msg, error_msg_maxsize
    );

    if (status_code == PROVER_OK) {
      resolve(@(public_buffer_size));
    } else {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogInfo(@"Error:%@", errorString);
      reject([NSString stringWithFormat:@"%d", status_code], errorString, nil);
    }
}

RCT_EXPORT_METHOD(groth16PublicSizeForZkeyFile:(nonnull NSString *)zkey_file_path
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    const char *file_path = [zkey_file_path UTF8String];

    unsigned long error_msg_maxsize = (unsigned long) [errBufferSize intValue];
    char error_msg[error_msg_maxsize];

    unsigned long public_buffer_size = 0;

    int status_code = groth16_public_size_for_zkey_file(
      file_path,
      &public_buffer_size,
      error_msg, error_msg_maxsize
    );

    if (status_code == PROVER_OK) {
      resolve(@(public_buffer_size));
    } else {
      NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
      RCTLogError(@"Error:%@", errorString);
      reject([NSString stringWithFormat:@"%d", status_code], errorString, nil);
    }
}

@end
