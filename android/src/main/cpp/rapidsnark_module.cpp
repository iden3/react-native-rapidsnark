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

    jlong *nativeProofSizeArr = env->GetLongArrayElements(proofSize, 0);
    jlong *nativePublicSizeArr = env->GetLongArrayElements(publicSize, 0);

    unsigned long nativeProofSize = nativeProofSizeArr[0];
    unsigned long nativePublicSize = nativePublicSizeArr[0];

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

JNIEXPORT jint JNICALL Java_com_rapidsnark_GrothProver_groth16ProverZkeyFile(
        JNIEnv *env, jobject obj,
        jstring zkeyPath,
        jbyteArray wtnsBuffer, jlong wtnsSize,
        jbyteArray proofBuffer, jlongArray proofSize,
        jobjectArray publicBufferArr, jlongArray publicSize,
        jbyteArray errorMsg, jlong errorMsgMaxSize
) {
    LOGE("groth16ProverZkeyFile native called");

    // Convert jbyteArray to native types
    const char *nativeZkeyPath = env->GetStringUTFChars(zkeyPath, nullptr);

    void *nativeWtnsBuffer = env->GetByteArrayElements(wtnsBuffer, nullptr);

    char *nativeProofBuffer = (char *) env->GetByteArrayElements(proofBuffer, nullptr);
    char *nativeErrorMsg = (char *) env->GetByteArrayElements(errorMsg, nullptr);

    jbyteArray publicBuffer = (jbyteArray) env->GetObjectArrayElement(publicBufferArr, 0);
    char *nativePublicBuffer = (char *) env->GetByteArrayElements(publicBuffer, nullptr);

    jlong *nativeProofSizeArr = env->GetLongArrayElements(proofSize, 0);
    jlong *nativePublicSizeArr = env->GetLongArrayElements(publicSize, 0);

    unsigned long nativeProofSize = nativeProofSizeArr[0];
    unsigned long nativePublicSize = nativePublicSizeArr[0];

    // Call the groth16_prover function`
    int status_code = groth16_prover_zkey_file(
            nativeZkeyPath,
            nativeWtnsBuffer, wtnsSize,
            nativeProofBuffer, &nativeProofSize,
            nativePublicBuffer, &nativePublicSize,
            nativeErrorMsg, errorMsgMaxSize
    );

    if (status_code == PROVER_ERROR_SHORT_BUFFER) {
        // The public buffer is too small, so we need to allocate a new one
        LOGE("groth16ProverZkeyFile short buffer, extending the buffer and calling again");

        LOGE("groth16ProverZkeyFile new public buffer size:%lu", nativePublicSize);
        nativePublicBuffer = new char[nativePublicSize];

        status_code = groth16_prover_zkey_file(
                nativeZkeyPath,
                nativeWtnsBuffer, wtnsSize,
                nativeProofBuffer, &nativeProofSize,
                nativePublicBuffer, &nativePublicSize,
                nativeErrorMsg, errorMsgMaxSize
        );

        jbyteArray updatedPublicBuffer = env->NewByteArray(nativePublicSize);
        env->SetByteArrayRegion(updatedPublicBuffer, 0, nativePublicSize,
                                (jbyte *) nativePublicBuffer);
        env->SetObjectArrayElement(publicBufferArr, 0, updatedPublicBuffer);
        LOGE("groth16ProverZkeyFile finished with new public buffer");
        env->DeleteLocalRef(updatedPublicBuffer);
    }

    // Convert the results back to JNI types
    env->SetLongArrayRegion(proofSize, 0, 1, (jlong *) &nativeProofSize);
    env->SetLongArrayRegion(publicSize, 0, 1, (jlong *) &nativePublicSize);

    // Release the native buffers
    env->ReleaseByteArrayElements(wtnsBuffer, (jbyte *) nativeWtnsBuffer, 0);
    env->ReleaseByteArrayElements(proofBuffer, (jbyte *) nativeProofBuffer, 0);
    env->ReleaseByteArrayElements(publicBuffer, (jbyte *) nativePublicBuffer, 0);
    env->ReleaseByteArrayElements(errorMsg, (jbyte *) nativeErrorMsg, 0);

    return status_code;
}

JNIEXPORT jboolean JNICALL Java_com_rapidsnark_GrothProver_groth16Verifier(
        JNIEnv *env, jobject obj, jstring inputs, jstring proof, jstring verificationKey
) {
    LOGE("groth16Verifier native called");

    // Convert jstring to native types
    const char *nativeInputs = env->GetStringUTFChars(inputs, nullptr);
    const char *nativeProof = env->GetStringUTFChars(proof, nullptr);
    const char *nativeVerificationKey = env->GetStringUTFChars(verificationKey, nullptr);

    // Call the groth16_verify function
    bool result = groth16_verify(nativeInputs, nativeProof, nativeVerificationKey);

    // Release the native buffers
    env->ReleaseStringUTFChars(inputs, nativeInputs);
    env->ReleaseStringUTFChars(proof, nativeProof);
    env->ReleaseStringUTFChars(verificationKey, nativeVerificationKey);

    return result;
}

JNIEXPORT jlong JNICALL Java_com_rapidsnark_GrothProver_calculatePublicBufferSize(
        JNIEnv *env, jobject obj,
        jbyteArray zkeyBuffer, jlong zkeySize
) {
    LOGE("calculatePublicBufferSize native called");

    void *nativeZkeyBuffer = env->GetByteArrayElements(zkeyBuffer, nullptr);

    unsigned long nativePublicSize = CalcPublicBufferSize(
            nativeZkeyBuffer, zkeySize
    );

    LOGE("calculatePublicBufferSize:%lu", nativePublicSize);

    return nativePublicSize;
}

#ifdef __cplusplus
}
#endif
