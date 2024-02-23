package com.rapidsnark;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import android.util.Base64;
import android.util.Log;

@ReactModule(name = RapidsnarkModule.NAME)
public class RapidsnarkModule extends ReactContextBaseJavaModule {
  public static final String NAME = "Rapidsnark";

  // Prover status codes
  public static final int PROVER_OK = 0x0;
  public static final int PROVER_ERROR = 0x1;
  public static final int PROVER_ERROR_SHORT_BUFFER = 0x2;
  public static final int PROVER_INVALID_WITNESS_LENGTH = 0x3;

  // Verifier status codes
  public static final int VERIFIER_VALID_PROOF = 0x0;
  public static final int VERIFIER_INVALID_PROOF = 0x1;
  public static final int VERIFIER_ERROR = 0x2;

  public RapidsnarkModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  // groth16Prover is a JNI bridge to the C library rapidsnark.
  // It takes a zkey and witness as byte arrays and returns a proof and public signals as byte arrays.
  // This function is used to generate groth16 proofs.
  // For small zkey file it can be used as is. (apx. up to ~80mb) For big zkey files it is better to use `groth16_prover_zkey_file`
  // @zkeyBytes - zkey file as byte array
  // @wtnsBytes - witness file as byte array
  // @proofBufferSize - size of the proof buffer, in most case default value should be ok (16384)
  // @publicBufferSize - size of the public buffer, can be calculated with `calculate_public_buffer_size`
  // @errorBufferSize - 256 should be enough
  // @return - promise with result object {proof: string, pub_signals: string}
  //
  // Error codes:
  // PROVER_OK                     0x0
  // PROVER_ERROR                  0x1
  // PROVER_ERROR_SHORT_BUFFER     0x2 - in case of a short buffer error, also updates proof_size and public_size with actual proof and public sizess
  // PROVER_INVALID_WITNESS_LENGTH 0x3
  //
  // In case of error promis.reject(statusCode, errorString);
  @ReactMethod
  public void groth16Prove(String zkeyBytes1, String wtnsBytes1,
                             Integer proofBufferSize, Integer publicBufferSize,
                             Integer errorBufferSize,
                             Promise promise) {
    try {
      RapidsnarkJniBridge rapidsnarkJNI = new RapidsnarkJniBridge();

      // Decode base64
      byte[] zkeyBytes = Base64.decode(zkeyBytes1, Base64.DEFAULT);
      byte[] wtnsBytes = Base64.decode(wtnsBytes1, Base64.DEFAULT);

      // Create buffers to get results
      byte[] proof_buffer = new byte[proofBufferSize];
      long[] proof_buffer_size = new long[]{proofBufferSize};
      byte[] public_buffer = new byte[publicBufferSize];
      long[] public_buffer_size = new long[]{publicBufferSize};
      byte[] error_msg = new byte[errorBufferSize];

      // This will require you to write a JNI bridge to your C library.
      int statusCode = groth16_prove(rapidsnarkJNI, zkeyBytes, wtnsBytes, proof_buffer,
        proof_buffer_size, public_buffer, public_buffer_size, error_msg);

      if (statusCode != PROVER_OK) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);

        promise.reject(String.valueOf(statusCode), errorString);
        return;
      }

      // Convert byte arrays to strings
      String proofResult = new String(proof_buffer, StandardCharsets.UTF_8).trim();
      String publicResult = new String(public_buffer, StandardCharsets.UTF_8).trim();

      if (proofResult.isEmpty()) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        promise.reject(String.valueOf(statusCode), errorString);
        return;
      }

      WritableMap result = new WritableNativeMap();
      result.putString("proof", proofResult);
      result.putString("pub_signals", publicResult);

      promise.resolve(result);

    } catch (Exception e) {
      promise.reject("1", e.getMessage());
    }
  }

  private static int groth16_prove(RapidsnarkJniBridge rapidsnarkJNI, byte[] zkeyBytes,
                                  byte[] wtnsBytes, byte[] proof_buffer, long[] proof_buffer_size,
                                  byte[] public_buffer, long[] public_buffer_size, byte[] error_msg) {
    int statusCode = rapidsnarkJNI.groth16Prove(
      zkeyBytes, zkeyBytes.length,
      wtnsBytes, wtnsBytes.length,
      proof_buffer, proof_buffer_size,
      public_buffer, public_buffer_size,
      error_msg, error_msg.length
    );

    return statusCode;
  }

  // groth16ProveWithZKeyFilePath is a JNI bridge to the C library rapidsnark.
  // It takes a PATH to  zKey and witness as byte arrays and returns a proof and public signals as byte arrays.
  // This function is used to generate groth16 proofs.
  // @zkeyPath - path to zkey file
  // @wtnsBytes - witness file as byte array
  // @proofBufferSize - size of the proof buffer, in most case default value should be ok ()
  // @publicBufferSize - size of the public buffer, can be calculated with `calculate_public_buffer_size`
  // @errorBufferSize - 256 should be enough
  // @return - promise with result object {proof: string, pub_signals: string}
  //
  // Error codes:
  // PROVER_OK                     0x0
  // PROVER_ERROR                  0x1
  // PROVER_ERROR_SHORT_BUFFER     0x2 - in case of a short buffer error, also updates proof_size and public_size with actual proof and public sizess
  // PROVER_INVALID_WITNESS_LENGTH 0x3
  //
  // In case of error promis.reject(statusCode, errorString);
  @ReactMethod
  public void groth16ProveWithZKeyFilePath(String zkeyPath, String wtnsBytes1,
                                       Integer proofBufferSize, Integer publicBufferSize,
                                       Integer errorBufferSize,
                                       Promise promise) {
    try {
      RapidsnarkJniBridge rapidsnarkJNI = new RapidsnarkJniBridge();

      // Decode base64
      byte[] wtnsBytes = Base64.decode(wtnsBytes1, Base64.DEFAULT);

      // Create buffers to get results
      byte[] proof_buffer = new byte[proofBufferSize];
      long[] proof_buffer_size = new long[]{proofBufferSize};
      byte[] public_buffer = new byte[publicBufferSize];
      long[] public_buffer_size = new long[]{publicBufferSize};
      byte[] error_msg = new byte[errorBufferSize];

      // This will require you to write a JNI bridge to your C library.
      int statusCode = groth16ProveWithZKeyFilePath(rapidsnarkJNI, zkeyPath, wtnsBytes,
        proof_buffer, proof_buffer_size, public_buffer, public_buffer_size, error_msg);

      if (statusCode != PROVER_OK) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        promise.reject(String.valueOf(statusCode), errorString);
        return;
      }

      // Convert byte arrays to strings
      String proofResult = new String(proof_buffer, StandardCharsets.UTF_8).trim();
      String publicResult = new String(public_buffer, StandardCharsets.UTF_8).trim();

      if (proofResult.isEmpty()) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        promise.reject(String.valueOf(statusCode), errorString);
        return;
      }

      WritableMap result = new WritableNativeMap();
      result.putString("proof", proofResult);
      result.putString("pub_signals", publicResult);

      promise.resolve(result);

    } catch (Exception e) {
      promise.reject("1", e.getMessage());
    }
  }

  private static int groth16ProveWithZKeyFilePath(RapidsnarkJniBridge rapidsnarkJNI, String zkeyPath,
                                           byte[] wtnsBytes, byte[] proof_buffer,
                                           long[] proof_buffer_size, byte[] public_buffer,
                                           long[] public_buffer_size, byte[] error_msg) {
    int statusCode = rapidsnarkJNI.groth16ProveWithZKeyFilePath(
      zkeyPath,
      wtnsBytes, wtnsBytes.length,
      proof_buffer, proof_buffer_size,
      public_buffer, public_buffer_size,
      error_msg, error_msg.length
    );

    return statusCode;
  }

  // groth16Verify is a JNI bridge to the C library rapidsnark.
  // Verifies a proof and returns true or false.
  // @inputs - public signals as string
  // @proof - proof as string
  @ReactMethod
  public void groth16Verify(String proof, String inputs, String verificationKey,
                             Integer errorBufferSize, Promise promise) {
    try {
      byte[] error_msg = new byte[errorBufferSize];

      int status_code = new RapidsnarkJniBridge().groth16Verify(
        proof,
        inputs,
        verificationKey,
        error_msg,
        error_msg.length
      );
      if (status_code == VERIFIER_ERROR) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        promise.reject(String.valueOf(status_code), errorString);
        return;
      }

      promise.resolve(status_code == VERIFIER_VALID_PROOF);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }

  // calculate_public_buffer_size is a JNI bridge to the C library rapidsnark.
  // Calculates the size of the public buffer for a given zkey.
  // In production better to use hardcoded values or cashed values, because the calculation is slow.
  @ReactMethod
  public void groth16PublicSizeForZkeyBuf(String zkeyBytes1, Integer errorBufferSize, Promise promise) {
    try {
      byte[] error_msg = new byte[errorBufferSize];

      // Decode base64
      byte[] zkeyBytes = Base64.decode(zkeyBytes1, Base64.DEFAULT);

      int public_buffer_size = (int) (new RapidsnarkJniBridge().groth16PublicSizeForZkeyBuf(
        zkeyBytes, zkeyBytes.length,
        error_msg, Long.valueOf(errorBufferSize)
      ));

      promise.resolve(public_buffer_size);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }

  // calculate_public_buffer_size is a JNI bridge to the C library rapidsnark.
  // Calculates the size of the public buffer for a given zkey.
  // In production better to use hardcoded values or cashed values, because the calculation is slow.
  @ReactMethod
  public void groth16PublicSizeForZkeyFile(String zkeyPath, Integer errorBufferSize, Promise promise) {
    try {
      byte[] error_msg = new byte[errorBufferSize];

      int public_buffer_size = (int) (new RapidsnarkJniBridge().groth16PublicSizeForZkeyFile(
        zkeyPath,
        error_msg, Long.valueOf(errorBufferSize)
      ));

      promise.resolve(public_buffer_size);
    } catch (Exception e) {
      promise.reject(e.getMessage());
    }
  }
}

class RapidsnarkJniBridge {

  static {
    System.loadLibrary("rapidsnark_module");
  }

  public native int groth16Prove(byte[] zkeyBuffer, long zkeySize,
                                  byte[] wtnsBuffer, long wtnsSize,
                                  byte[] proofBuffer, long[] proofSize,
                                  byte[] publicBuffer, long[] publicSize,
                                  byte[] errorMsg, long errorMsgMaxSize);

  public native int groth16ProveWithZKeyFilePath(String zkeyPath,
                                          byte[] wtnsBuffer, long wtnsSize,
                                          byte[] proofBuffer, long[] proofSize,
                                          byte[] publicBuffer, long[] publicSize,
                                          byte[] errorMsg, long errorMsgMaxSize);

  public native int groth16Verify(String proof, String inputs, String verificationKey,
                                    byte[] errorMsg, long errorMsgMaxSize);

  public native long groth16PublicSizeForZkeyBuf(byte[] zkeyBuffer, long zkeySize, byte[] errorMsg, long errorMsgMaxSize);

  public native long groth16PublicSizeForZkeyFile(String zkeyPath, byte[] errorMsg, long errorMsgMaxSize);
}
