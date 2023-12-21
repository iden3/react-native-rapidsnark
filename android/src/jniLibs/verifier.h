#ifndef GROTH16_VERIFY_H
#define GROTH16_VERIFY_H

#ifdef __cplusplus
extern "C" {
#endif

bool groth16_verify(const char* inputs, const char* proof, const char* verification_key);

#ifdef __cplusplus
}
#endif

#endif
