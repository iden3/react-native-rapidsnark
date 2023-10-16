#include <jni.h>
#include "react-native-rapidsnark.h"

extern "C"
JNIEXPORT jint JNICALL
Java_com_rapidsnark_RapidsnarkModule_groth16Prover
  (JNIEnv *env, jobject obj, jbyteArray zkeyBuffer, jlong zkeySize,
   jbyteArray wtnsBuffer, jlong wtnsSize,
   jbyteArray proofBuffer, jlongArray proofSize,
   jbyteArray publicBuffer, jlongArray publicSize,
   jbyteArray errorMsg, jlong errorMsgMaxSize) {

    // Convert jbyteArray to native types
    void *nativeZkeyBuffer = env->GetByteArrayElements(env, zkeyBuffer, NULL);
    void *nativeWtnsBuffer = env->GetByteArrayElements(env, wtnsBuffer, NULL);
    char *nativeProofBuffer = env->GetByteArrayElements(env, proofBuffer, NULL);
    char *nativePublicBuffer = env->GetByteArrayElements(env, publicBuffer, NULL);
    char *nativeErrorMsg = env->GetByteArrayElements(env, errorMsg, NULL);

    unsigned long nativeProofSize;
    unsigned long nativePublicSize;

    // Call the groth16_prover function
    int result = groth16_prover(nativeZkeyBuffer, zkeySize,
                                nativeWtnsBuffer, wtnsSize,
                                nativeProofBuffer, &nativeProofSize,
                                nativePublicBuffer, &nativePublicSize,
                                nativeErrorMsg, errorMsgMaxSize);

    // Convert the results back to JNI types
    env->SetLongArrayRegion( proofSize, 0, 1, &nativeProofSize);
    env->SetLongArrayRegion( publicSize, 0, 1, &nativePublicSize);

    // Release the native buffers
    env->ReleaseByteArrayElements( zkeyBuffer, nativeZkeyBuffer, 0);
    env->ReleaseByteArrayElements( wtnsBuffer, nativeWtnsBuffer, 0);
    env->ReleaseByteArrayElements( proofBuffer, nativeProofBuffer, 0);
    env->ReleaseByteArrayElements( publicBuffer, nativePublicBuffer, 0);
    env->ReleaseByteArrayElements( errorMsg, nativeErrorMsg, 0);

    return result;
}


