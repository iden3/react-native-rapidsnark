#import "Rapidsnark.h"

#import <React/RCTLog.h>
#if __has_include(<react_native_rapidsnark/react_native_rapidsnark-Swift.h>)
#import <react_native_rapidsnark/react_native_rapidsnark-Swift.h>
#else
#import "react_native_rapidsnark-Swift.h"
#endif

@implementation Rapidsnark
RCT_EXPORT_MODULE(Rapidsnark)

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_METHOD(groth16Prove:(nonnull NSString *)zkey
                  witness:(nonnull NSString *)witness
                  proofBufferSize:(nonnull NSNumber *)proofBufferSize
                  publicBufferSize:(nonnull NSNumber *)publicBufferSize
                  errorBufferSize:(nonnull NSNumber *)errorBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // NSData decode base64
    NSData* zkeyData = [[NSData alloc]initWithBase64EncodedString:zkey options:0];
    NSData* wtnsData = [[NSData alloc]initWithBase64EncodedString:witness options:0];

    NSError* error;
    NSDictionary *result = [
        RapidsnarkProxy
        groth16ProveProxyWithZkey: zkeyData
        witness: wtnsData
        proofBufferSize: proofBufferSize
        publicBufferSize: publicBufferSize
        errBufferSize: errorBufferSize
        error: &error
    ];

    if (!error) {
        resolve(result);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_EXPORT_METHOD(groth16ProveWithZKeyFilePath:(nonnull NSString *)zkeyFilePath
                  witness:(nonnull NSString *)witness
                  proofBufferSize:(nonnull NSNumber *)proofBufferSize
                  publicBufferSize:(nonnull NSNumber *)publicBufferSize
                  errorBufferSize:(nonnull NSNumber *)errorBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSData* wtnsData = [[NSData alloc]initWithBase64EncodedString:witness options:0];

    NSError* error;
    NSDictionary* result = [
        RapidsnarkProxy
        groth16ProveWithZkeyFilePathProxyWithZkeyFilePath: zkeyFilePath
        witness: wtnsData
        proofBufferSize: proofBufferSize
        publicBufferSize: publicBufferSize
        errBufferSize: errorBufferSize
        error: &error
    ];

    if (!error) {
        resolve(result);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_EXPORT_METHOD(groth16Verify:(nonnull NSString *)proof
                  publicSignals:(nonnull NSString *)publicSignals
                  verificationKey:(nonnull NSString *)verificationKey
                  errorBufferSize:(nonnull NSNumber *)errorBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSError* error;
    NSNumber* result = [
        RapidsnarkProxy
        groth16VerifyProxyWithProof: proof
        inputs: publicSignals
        verificationKey: verificationKey
        errorBufferSize: errorBufferSize
        error: &error
    ];

    if (!error) {
        resolve(@(result.intValue == 0));
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_EXPORT_METHOD(groth16PublicSizeForZkeyBuf:(nonnull NSString *)zkeyBytes
                  errorBufferSize:(nonnull NSNumber *)errorBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // NSData decode base64
    NSData* zkeyData = [[NSData alloc]initWithBase64EncodedString:zkeyBytes options:0];

    NSError* error;
    NSNumber* publicBufferSize = [
        RapidsnarkProxy
        groth16PublicSizeForZkeyBufProxyWithZkey: zkeyData
        errorBufferSize: errorBufferSize
        error: &error
    ];

    if (!error) {
        resolve(publicBufferSize);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_EXPORT_METHOD(groth16PublicSizeForZkeyFile:(nonnull NSString *)zkeyFilePath
                  errorBufferSize:(nonnull NSNumber *)errorBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSError* error;
    NSNumber* publicBufferSize = [
        RapidsnarkProxy
        groth16PublicSizeForZkeyFileProxyWithZkeyPath: zkeyFilePath
        errorBufferSize: errorBufferSize
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
