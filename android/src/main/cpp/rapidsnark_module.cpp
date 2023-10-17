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
    void *nativeZkeyBuffer = env->GetByteArrayElements(zkeyBuffer, NULL);
    void *nativeWtnsBuffer = env->GetByteArrayElements(wtnsBuffer, NULL);

    // TODO - figure out right way to cast these
    char *nativeProofBuffer = (char *) env->GetByteArrayElements(proofBuffer, NULL);
    char *nativePublicBuffer = (char *) env->GetByteArrayElements(publicBuffer, NULL);
    char *nativeErrorMsg = (char *) env->GetByteArrayElements(errorMsg, NULL);

    LOGE("nativeZkeyBuffer %p", nativeZkeyBuffer);
    LOGE("nativeWtnsBuffer %p", nativeWtnsBuffer);
    LOGE("nativeProofBuffer %s", nativeProofBuffer);
    LOGE("nativePublicBuffer %s", nativePublicBuffer);
    LOGE("nativeErrorMsg %s", nativeErrorMsg);

    unsigned long nativeProofSize;
    unsigned long nativePublicSize;

    LOGE("initialized native buffers, calling groth16_prover");

    // Call the groth16_prover function
    int result = groth16_prover(
            nativeZkeyBuffer, zkeySize,
            nativeWtnsBuffer, wtnsSize,
            nativeProofBuffer, &nativeProofSize,
            nativePublicBuffer, &nativePublicSize,
            nativeErrorMsg, errorMsgMaxSize
    );

    LOGE("groth16_prover returned");

    /*
    // Convert the results back to JNI types
    env->SetLongArrayRegion(proofSize, 0, 1, &nativeProofSize);
    env->SetLongArrayRegion(publicSize, 0, 1, &nativePublicSize);

    // Release the native buffers
    env->ReleaseByteArrayElements(zkeyBuffer, nativeZkeyBuffer, 0);
    env->ReleaseByteArrayElements(wtnsBuffer, nativeWtnsBuffer, 0);
    env->ReleaseByteArrayElements(proofBuffer, nativeProofBuffer, 0);
    env->ReleaseByteArrayElements(publicBuffer, nativePublicBuffer, 0);
    env->ReleaseByteArrayElements(errorMsg, nativeErrorMsg, 0);
*/
    LOGE("buffers released, returning result");

    return result;
}

#ifdef __cplusplus
}
#endif
