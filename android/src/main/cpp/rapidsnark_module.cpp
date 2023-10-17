#include <jni.h>
#include "react-native-rapidsnark.h"
#include "prover.h"

extern "C"


JNIEXPORT jint JNICALL Java_com_rapidsnark_RapidsnarkModule_groth16Prover
        (JNIEnv *env, jobject obj,
         jbyteArray zkeyBuffer, jlong zkeySize,
         jbyteArray wtnsBuffer, jlong wtnsSize,
         jbyteArray proofBuffer, jlongArray proofSize,
         jbyteArray publicBuffer, jlongArray publicSize,
         jbyteArray errorMsg, jlong errorMsgMaxSize) {

    // Convert jbyteArray to native types
    void *nativeZkeyBuffer = env->GetByteArrayElements(zkeyBuffer, NULL);
    void *nativeWtnsBuffer = env->GetByteArrayElements(wtnsBuffer, NULL);
    char *nativeProofBuffer = (char *) env->GetByteArrayElements(proofBuffer, NULL);
    char *nativePublicBuffer = (char *) env->GetByteArrayElements(publicBuffer, NULL);
    char *nativeErrorMsg = (char *) env->GetByteArrayElements(errorMsg, NULL);

    unsigned long nativeProofSize;
    unsigned long nativePublicSize;

    // Call the groth16_prover function
    int result = groth16_prover(nativeZkeyBuffer, zkeySize,
                                nativeWtnsBuffer, wtnsSize,
                                nativeProofBuffer, &nativeProofSize,
                                nativePublicBuffer, &nativePublicSize,
                                nativeErrorMsg, errorMsgMaxSize);

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


