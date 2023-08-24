#include <jni.h>
#include "react-native-rapidsnark.h"

extern "C"
JNIEXPORT jdouble JNICALL
Java_com_rapidsnark_RapidsnarkModule_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return rapidsnark::multiply(a, b);
}
