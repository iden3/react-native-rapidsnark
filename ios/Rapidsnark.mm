#import "prover.h"
#import "Rapidsnark.h"

#import <React/RCTLog.h>

@implementation Rapidsnark
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(groth16_prover:(NSString *)zkeyBytes1
                  witnessData:(NSString *)wtnsBytes1
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  CFTimeInterval startTime = CACurrentMediaTime(); // Capture start time

    RCTLogInfo(@"groth16_prover called");

    // TODO: we should accept just the bytes as input, not base64 encoded strings
    // NSData decode base64
    NSData* zkeyBytes = [[NSData alloc]initWithBase64EncodedString:zkeyBytes1 options:0];
    NSData* wtnsBytes = [[NSData alloc]initWithBase64EncodedString:wtnsBytes1 options:0];

    const void *zkey_buffer = [zkeyBytes bytes];
    unsigned long zkey_size = [zkeyBytes length];

    const void *wtns_buffer = [wtnsBytes bytes];
    unsigned long wtns_size = [wtnsBytes length];

    char proof_buffer[16384];
    unsigned long proof_size = 16384;

    char public_buffer[16384];
    unsigned long public_size = 16384;

    char error_msg[256];
    unsigned long error_msg_maxsize = 256;

    groth16_prover(zkey_buffer, zkey_size, wtns_buffer, wtns_size, proof_buffer, &proof_size, public_buffer, &public_size, error_msg, error_msg_maxsize);

    CFTimeInterval endTime = CACurrentMediaTime(); // Capture end time
    RCTLogInfo(@"Execution time: %f seconds", endTime - startTime); // Log the execution time

    RCTLogInfo(@"groth16_prover 4");
    // Handle the result of groth16_prover
    NSString *proofResult = [NSString stringWithCString:proof_buffer encoding:NSUTF8StringEncoding];
    NSString *publicResult = [NSString stringWithCString:public_buffer encoding:NSUTF8StringEncoding];
    RCTLogInfo(@"groth16_prover 5");

    if(proofResult.length > 0) {
        RCTLogInfo(@"groth16_prover 6");
        RCTLogInfo(@"%@", proofResult);
        RCTLogInfo(@"%@", publicResult);
        resolve(proofResult);
    } else {
        RCTLogInfo(@"groth16_prover 7");
        NSString *errorString = [NSString stringWithCString:error_msg encoding:NSUTF8StringEncoding];
        reject(@"PROVER_ERROR", errorString, nil);
    }


}

@end
