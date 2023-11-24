#include "rapidsnark_module.h"

#define TAG "RapidsnarkExampleNative"
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__)

#ifdef __cplusplus
extern "C" {
#endif

JNIEXPORT jint JNICALL Java_com_rapidsnark_GrothProver_groth16Prover(
        JNIEnv *env, jobject obj,
        jbyteArray zkeyBuffer, jlong zkeySize,
        jbyteArray wtnsBuffer, jlong wtnsSize,
        jbyteArray proofBuffer, jlongArray proofSize,
        jbyteArray publicBuffer, jlongArray publicSize,
        jbyteArray errorMsg, jlong errorMsgMaxSize
) {
    LOGE("groth16Prover native called");

    // Convert jbyteArray to native types
    void *nativeZkeyBuffer = env->GetByteArrayElements(zkeyBuffer, nullptr);
    void *nativeWtnsBuffer = env->GetByteArrayElements(wtnsBuffer, nullptr);

    char *nativeProofBuffer = (char *) env->GetByteArrayElements(proofBuffer, nullptr);
    char *nativePublicBuffer = (char *) env->GetByteArrayElements(publicBuffer, nullptr);
    char *nativeErrorMsg = (char *) env->GetByteArrayElements(errorMsg, nullptr);

    unsigned long nativeProofSize = 16384;
    unsigned long nativePublicSize = 16384;

    // Call the groth16_prover function
    int result = groth16_prover(
            nativeZkeyBuffer, zkeySize,
            nativeWtnsBuffer, wtnsSize,
            nativeProofBuffer, &nativeProofSize,
            nativePublicBuffer, &nativePublicSize,
            nativeErrorMsg, errorMsgMaxSize
    );

    // Convert the results back to JNI types
    env->SetLongArrayRegion(proofSize, 0, 1, (jlong *) &nativeProofSize);
    env->SetLongArrayRegion(publicSize, 0, 1, (jlong *) &nativePublicSize);

    // Release the native buffers
    env->ReleaseByteArrayElements(zkeyBuffer, (jbyte *) nativeZkeyBuffer, 0);
    env->ReleaseByteArrayElements(wtnsBuffer, (jbyte *) nativeWtnsBuffer, 0);
    env->ReleaseByteArrayElements(proofBuffer, (jbyte *) nativeProofBuffer, 0);
    env->ReleaseByteArrayElements(publicBuffer, (jbyte *) nativePublicBuffer, 0);
    env->ReleaseByteArrayElements(errorMsg, (jbyte *) nativeErrorMsg, 0);

    return result;
}

#ifdef __cplusplus
}
#endif
