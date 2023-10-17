#ifndef ANDROID_CMAKE_RAPIDSNARK_MODULE_H
#define ANDROID_CMAKE_RAPIDSNARK_MODULE_H

#include <jni.h>
#include <sys/mman.h>
#include <android/log.h>
#include "prover.h"

extern "C" {

JNIEXPORT jint JNICALL Java_com_rapidsnark_GrothProver_groth16Prover(
        JNIEnv *env, jobject obj,
        jbyteArray zkeyBuffer, jlong zkeySize,
        jbyteArray wtnsBuffer, jlong wtnsSize,
        jbyteArray proofBuffer, jlongArray proofSize,
        jbyteArray publicBuffer, jlongArray publicSize,
        jbyteArray errorMsg, jlong errorMsgMaxSize
);

}

#endif //ANDROID_CMAKE_RAPIDSNARK_MODULE_H




