#import "Rapidsnark.h"

#import <React/RCTLog.h>
#import <react_native_rapidsnark/react_native_rapidsnark-Swift.h>

@implementation Rapidsnark
RCT_EXPORT_MODULE(RNRapidsnark)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (BOOL)bridgelessEnabled
{
    return NO;
}

RCT_REMAP_METHOD(groth16Prove,
                 zkeyData:(nonnull NSString *)zkeyBytes
                 witnessData:(nonnull NSString *)wtnsBytes
                 proofBufferSize:(nonnull NSNumber *)proofBufferSize
                 publicBufferSize:(nonnull NSNumber *)publicBufferSize
                 errBufferSize:(nonnull NSNumber *)errBufferSize
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    [
        self groth16Prove: zkeyBytes
        witness: wtnsBytes
        proofBufferSize: proofBufferSize.doubleValue
        publicBufferSize: publicBufferSize.doubleValue
        errorBufferSize: errBufferSize.doubleValue
        resolve: resolve
        reject: reject
    ];
}

- (void)groth16Prove:(NSString *)zkey
             witness:(NSString *)witness
     proofBufferSize:(double)proofBufferSize
    publicBufferSize:(double)publicBufferSize
     errorBufferSize:(double)errorBufferSize
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    // NSData decode base64
    NSData* zkeyData = [[NSData alloc]initWithBase64EncodedString:zkey options:0];
    NSData* wtnsData = [[NSData alloc]initWithBase64EncodedString:witness options:0];

    NSError* error;
    NSDictionary *result = [
        RapidsnarkProxy
        groth16ProveProxyWithZkey: zkeyData
        witness: wtnsData
        proofBufferSize: [NSNumber numberWithDouble: proofBufferSize]
        publicBufferSize: [NSNumber numberWithDouble: publicBufferSize]
        errBufferSize: [NSNumber numberWithDouble: errorBufferSize]
        error: &error
    ];

    if (!error) {
        resolve(result);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_REMAP_METHOD(groth16ProveWithZKeyFilePath,
                 zkeyFilePath:(nonnull NSString *)zkeyFilePath
                 witnessData:(nonnull NSString *)wtnsBytes
                 proofBufferSize:(nonnull NSNumber *)proofBufferSize
                 publicBufferSize:(nonnull NSNumber *)publicBufferSize
                 errBufferSize:(nonnull NSNumber *)errBufferSize
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    [
        self groth16ProveWithZKeyFilePath: zkeyFilePath
        witness: wtnsBytes
        proofBufferSize: proofBufferSize.doubleValue
        publicBufferSize: publicBufferSize.doubleValue
        errorBufferSize: errBufferSize.doubleValue
        resolve: resolve
        reject: reject
    ];
}

- (void)groth16ProveWithZKeyFilePath:(NSString *)zkeyFilePath
                             witness:(NSString *)witness
                     proofBufferSize:(double)proofBufferSize
                    publicBufferSize:(double)publicBufferSize
                     errorBufferSize:(double)errorBufferSize
                             resolve:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject {
    NSData* wtnsData = [[NSData alloc]initWithBase64EncodedString:witness options:0];

    NSError* error;
    NSDictionary* result = [
        RapidsnarkProxy
        groth16ProveWithZkeyFilePathProxyWithZkeyFilePath: zkeyFilePath
        witness: wtnsData
        proofBufferSize: [NSNumber numberWithDouble: proofBufferSize]
        publicBufferSize: [NSNumber numberWithDouble: publicBufferSize]
        errBufferSize: [NSNumber numberWithDouble: errorBufferSize]
        error: &error
    ];

    if (!error) {
        resolve(result);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_REMAP_METHOD(groth16Verify,
                 proof:(nonnull NSString *)proof
                 inputs:(nonnull NSString *)inputs
                 verification_key:(nonnull NSString *)verification_key
                 errBufferSize:(nonnull NSNumber *)errBufferSize
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    [
        self groth16Verify:proof
        publicSignals:inputs
        verificationKey:verification_key
        errorBufferSize:errBufferSize.doubleValue
        resolve:resolve
        reject:reject
    ];
}


- (void)groth16Verify:(NSString *)proof
        publicSignals:(NSString *)publicSignals
      verificationKey:(NSString *)verificationKey
      errorBufferSize:(double)errorBufferSize
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
    NSError* error;
    NSNumber* result = [
        RapidsnarkProxy
        groth16VerifyProxyWithProof: proof
        inputs: publicSignals
        verificationKey: verificationKey
        errorBufferSize: [NSNumber numberWithDouble: errorBufferSize]
        error: &error
    ];

    if (!error) {
        resolve(@(result == 0));
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_REMAP_METHOD(groth16PublicSizeForZkeyBuf,
                 zkeyData:(nonnull NSString *)zkeyBytes
                 errBufferSize:(nonnull NSNumber *)errBufferSize
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    [
        self groth16PublicSizeForZkeyBuf: zkeyBytes
        errorBufferSize: errBufferSize.doubleValue
        resolve: resolve
        reject: reject
    ];
}


- (void)groth16PublicSizeForZkeyBuf:(NSString *)zkey
                    errorBufferSize:(double)errorBufferSize
                            resolve:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject {
    // NSData decode base64
    NSData* zkeyData = [[NSData alloc]initWithBase64EncodedString:zkey options:0];

    NSError* error;
    NSNumber* publicBufferSize = [
        RapidsnarkProxy
        groth16PublicSizeForZkeyBufProxyWithZkey: zkeyData
        errorBufferSize: [NSNumber numberWithDouble: errorBufferSize]
        error: &error
    ];

    if (!error) {
        resolve(publicBufferSize);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_REMAP_METHOD(groth16PublicSizeForZkeyFile,
                 zkeyFilePath:(nonnull NSString *)zkeyFilePath
                 errBufferSize:(nonnull NSNumber *)errBufferSize
                 resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    [
        self groth16PublicSizeForZkeyFile: zkeyFilePath
        errorBufferSize: errBufferSize.doubleValue
        resolve: resolve
        reject: reject
    ];
}

- (void)groth16PublicSizeForZkeyFile:(NSString *)zkeyPath
                     errorBufferSize:(double)errorBufferSize
                             resolve:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject {
    NSError* error;
    NSNumber* publicBufferSize = [
        RapidsnarkProxy
        groth16PublicSizeForZkeyFileProxyWithZkeyPath: zkeyPath
        errorBufferSize: [NSNumber numberWithDouble: errorBufferSize]
        error: &error
    ];

    if (!error) {
        resolve(publicBufferSize);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRapidsnarkSpecJSI>(params);
}
#endif

@end
