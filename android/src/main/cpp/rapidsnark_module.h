#ifndef ANDROID_CMAKE_RAPIDSNARK_MODULE_H
#define ANDROID_CMAKE_RAPIDSNARK_MODULE_H

#include <jni.h>
#include <sys/mman.h>
#include <android/log.h>
#include "prover.h"
#include "verifier.h"

extern "C" {

JNIEXPORT jint JNICALL Java_com_rapidsnark_RapidsnarkJniBridge_groth16Prover(
        JNIEnv *env, jobject obj,
        jbyteArray zkeyBuffer, jlong zkeySize,
        jbyteArray wtnsBuffer, jlong wtnsSize,
        jbyteArray proofBuffer, jlongArray proofSize,
        jbyteArray publicBuffer, jlongArray publicSize,
        jbyteArray errorMsg, jlong errorMsgMaxSize
);

JNIEXPORT jint JNICALL Java_com_rapidsnark_RapidsnarkJniBridge_groth16ProverZkeyFile(
        JNIEnv *env, jobject obj,
        jstring zkeyPath,
        jbyteArray wtnsBuffer, jlong wtnsSize,
        jbyteArray proofBuffer, jlongArray proofSize,
        jbyteArray publicBuffer, jlongArray publicSize,
        jbyteArray errorMsg, jlong errorMsgMaxSize
);

JNIEXPORT jint JNICALL Java_com_rapidsnark_RapidsnarkJniBridge_groth16Verifier(
        JNIEnv *env, jobject obj,
        jstring proof, jstring inputs, jstring verificationKey,
        jbyteArray errorMsg, jlong errorMsgMaxSize
);

JNIEXPORT jlong JNICALL Java_com_rapidsnark_RapidsnarkJniBridge_groth16PublicSizeForZkeyBuf(
        JNIEnv *env, jobject obj,
        jbyteArray zkeyBuffer, jlong zkeySize,
        jbyteArray errorMsg, jlong errorMsgMaxSize
);

JNIEXPORT jlong JNICALL Java_com_rapidsnark_RapidsnarkJniBridge_groth16PublicSizeForZkeyFile(
        JNIEnv *env, jobject obj,
        jstring zkeyPath,
        jbyteArray errorMsg, jlong errorMsgMaxSize
);

}

#endif //ANDROID_CMAKE_RAPIDSNARK_MODULE_H




