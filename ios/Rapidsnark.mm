#import "Rapidsnark.h"

#import <React/RCTLog.h>
#import <react_native_rapidsnark/react_native_rapidsnark-Swift.h>

@implementation Rapidsnark
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(groth16Prove:(nonnull NSString *)zkeyBytes
                  witnessData:(nonnull NSString *)wtnsBytes
                  proofBufferSize:(nonnull NSNumber *)proofBufferSize
                  publicBufferSize:(nonnull NSNumber *)publicBufferSize
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // NSData decode base64
    NSData* zkeyData = [[NSData alloc]initWithBase64EncodedString:zkeyBytes options:0];
    NSData* wtnsData = [[NSData alloc]initWithBase64EncodedString:wtnsBytes options:0];

    NSError* error;
    NSDictionary *result = [
        RapidsnarkProxy
        groth16ProveProxyWithZkey: zkeyData
        witness: wtnsData
        proofBufferSize: proofBufferSize
        publicBufferSize: publicBufferSize
        errBufferSize: errBufferSize
        error: &error
    ];

    if (!error) {
        resolve(result);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_EXPORT_METHOD(groth16ProveWithZKeyFilePath:(nonnull NSString *)zkey_file_path
                  witnessData:(nonnull NSString *)wtnsBytes
                  proofBufferSize:(nonnull NSNumber *)proofBufferSize
                  publicBufferSize:(nonnull NSNumber *)publicBufferSize
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSData* wtnsData = [[NSData alloc]initWithBase64EncodedString:wtnsBytes options:0];

    NSError* error;
    NSDictionary* result = [
        RapidsnarkProxy
        groth16ProveWithZkeyFilePathProxyWithZkeyFilePath: zkey_file_path
        witness: wtnsData
        proofBufferSize: proofBufferSize
        publicBufferSize: publicBufferSize
        errBufferSize: errBufferSize
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
                  inputs:(nonnull NSString *)inputs
                  verification_key:(nonnull NSString *)verification_key
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSError* error;
    NSNumber* result = [
        RapidsnarkProxy
        groth16VerifyProxyWithProof: proof
        inputs: inputs
        verificationKey: verification_key
        errorBufferSize: errBufferSize
        error: &error
    ];

    if (!error) {
        resolve(@(result == 0));
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_EXPORT_METHOD(groth16PublicSizeForZkeyBuf:(nonnull NSString *)zkeyBytes
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // NSData decode base64
    NSData* zkeyData = [[NSData alloc]initWithBase64EncodedString:zkeyBytes options:0];

    NSError* error;
    NSNumber* publicBufferSize = [
        RapidsnarkProxy
        groth16PublicSizeForZkeyBufProxyWithZkey: zkeyData
        errorBufferSize: errBufferSize
        error: &error
    ];

    if (!error) {
        resolve(publicBufferSize);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}

RCT_EXPORT_METHOD(groth16PublicSizeForZkeyFile:(nonnull NSString *)zkey_file_path
                  errBufferSize:(nonnull NSNumber *)errBufferSize
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSError* error;
    NSNumber* publicBufferSize = [
        RapidsnarkProxy
        groth16PublicSizeForZkeyFileProxyWithZkeyPath: zkey_file_path
        errorBufferSize: errBufferSize
        error: &error
    ];

    if (!error) {
        resolve(publicBufferSize);
    } else {
        NSString* message = error.userInfo[@"message"];
        reject([@(error.code) stringValue], message, nil);
    }
}
@end
