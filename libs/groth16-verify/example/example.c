#include "groth16-verify.h"
#include <stdio.h>
#include <stdlib.h>

char*
read_file(const char* fname) {
    FILE *file = NULL;
    char *buffer = NULL;
    size_t file_length, file_length2;
    _Bool ok = 0;

    file = fopen(fname, "rb");
    if (file == NULL) {
        perror("Error opening file");
        goto cleanup;
    }

    if (fseek(file, 0, SEEK_END) != 0) {
        perror("Error fseek the file");
        goto cleanup;
    };

    file_length = ftell(file);
    if (file_length == -1) {
        perror("Error ftell the file");
        goto cleanup;
    }

    rewind(file);

    buffer = (char *)malloc(file_length + 1);
    if (buffer == NULL) {
        perror("Error allocating memory");
        goto cleanup;
    }

    file_length2 = fread(buffer, 1, file_length, file);
    if (file_length2 == file_length) {
        ok = 1;
    }
    buffer[file_length] = '\0';

cleanup:
    if (file != NULL) {
        if (fclose(file) != 0) {
            perror("Error closing file");
            ok = 0;
        }
    }

    if (!ok && buffer != NULL) {
        free(buffer);
    }

    if (!ok) {
        return NULL;
    }

    return buffer;
}

int
main() {
    _Bool ok = 0;
    const char *inputs = read_file("../test-vectors/simple-circuit/public.json");
    if (inputs == NULL) {
        perror("Error reading inputs file");
        goto cleanup;
    }

    const char *proof = read_file("../test-vectors/simple-circuit/proof.json");
    if (proof == NULL) {
        perror("Error reading proof file");
        goto cleanup;
    }

    const char *verification_key = read_file("../test-vectors/simple-circuit/verification_key.json");
    if (verification_key == NULL) {
        perror("Error reading verification_key file");
        goto cleanup;
    }

    ok = groth16_verify(inputs, proof, verification_key);

cleanup:
    if (inputs != NULL) {
        free((void *)inputs);
    }

    if (proof != NULL) {
        free((void *)proof);
    }

    if (verification_key != NULL) {
        free((void *)verification_key);
    }

    if (!ok) {
        perror("verification failed");
        return 1;
    }

    return 0;
}
