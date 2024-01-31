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

  public static final int PROVER_OK = 0x0;
  public static final int PROVER_ERROR = 0x1;
  public static final int PROVER_ERROR_SHORT_BUFFER = 0x2;
  public static final int PROVER_INVALID_WITNESS_LENGTH = 0x3;

  public RapidsnarkModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void groth16_prover(String zkeyBytes1, String wtnsBytes1,
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
      int statusCode = groth16Prove(rapidsnarkJNI, zkeyBytes, wtnsBytes, proof_buffer,
        proof_buffer_size, public_buffer, public_buffer_size, error_msg);

      if (statusCode != PROVER_OK) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);

        if (statusCode == PROVER_INVALID_WITNESS_LENGTH) {
          promise.reject("groth16_prover error - invalid witness length:", errorString);
          return;
        }

        promise.reject("groth16_prover error:", errorString);
        return;
      }

      // Convert byte arrays to strings
      String proofResult = new String(proof_buffer, StandardCharsets.UTF_8).trim();
      String publicResult = new String(public_buffer, StandardCharsets.UTF_8).trim();

      if (proofResult.isEmpty()) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        promise.reject("groth16_prover error:", errorString);
        return;
      }

      WritableMap result = new WritableNativeMap();
      result.putString("proof", proofResult);
      result.putString("pub_signals", publicResult);

      promise.resolve(result);

    } catch (Exception e) {
      promise.reject("groth16_prover error", e.getMessage());
    }
  }

  private static int groth16Prove(RapidsnarkJniBridge rapidsnarkJNI, byte[] zkeyBytes,
                                  byte[] wtnsBytes, byte[] proof_buffer, long[] proof_buffer_size,
                                  byte[] public_buffer, long[] public_buffer_size, byte[] error_msg) {
    int statusCode = rapidsnarkJNI.groth16Prover(
      zkeyBytes, zkeyBytes.length,
      wtnsBytes, wtnsBytes.length,
      proof_buffer, proof_buffer_size,
      public_buffer, public_buffer_size,
      error_msg, error_msg.length
    );

    if (statusCode == PROVER_ERROR_SHORT_BUFFER) {
      Log.d("RapidsnarkModule", "groth16Prove: PROVER_ERROR_SHORT_BUFFER:" + public_buffer_size[0]);
      public_buffer = new byte[(int) public_buffer_size[0]];
      return groth16Prove(rapidsnarkJNI, zkeyBytes, wtnsBytes, proof_buffer,
        proof_buffer_size, public_buffer, public_buffer_size, error_msg);
    }
    return statusCode;
  }

  @ReactMethod
  public void groth16_prover_zkey_file(String zkeyPath, String wtnsBytes1,
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
      int statusCode = groth16ProverZkeyFile(rapidsnarkJNI, zkeyPath, wtnsBytes,
        proof_buffer, proof_buffer_size, public_buffer, public_buffer_size, error_msg);

      if (statusCode != PROVER_OK) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        if (statusCode == PROVER_INVALID_WITNESS_LENGTH) {
          promise.reject("groth16_prover_zkey_file error - invalid witness length:", errorString);
          return;
        }
        promise.reject("groth16_prover_zkey_file error:", errorString);
        return;
      }

      // Convert byte arrays to strings
      String proofResult = new String(proof_buffer, StandardCharsets.UTF_8).trim();
      String publicResult = new String(public_buffer, StandardCharsets.UTF_8).trim();

      if (proofResult.isEmpty()) {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        promise.reject("groth16_prover_zkey_file error:", errorString);
      }

      WritableMap result = new WritableNativeMap();
      result.putString("proof", proofResult);
      result.putString("pub_signals", publicResult);

      promise.resolve(result);

    } catch (Exception e) {
      promise.reject("groth16_prover_zkey_file error", e.getMessage());
    }
  }

  private static int groth16ProverZkeyFile(RapidsnarkJniBridge rapidsnarkJNI, String zkeyPath,
                                           byte[] wtnsBytes, byte[] proof_buffer,
                                           long[] proof_buffer_size, byte[] public_buffer,
                                           long[] public_buffer_size, byte[] error_msg) {
    int statusCode = rapidsnarkJNI.groth16ProverZkeyFile(
      zkeyPath,
      wtnsBytes, wtnsBytes.length,
      proof_buffer, proof_buffer_size,
      public_buffer, public_buffer_size,
      error_msg, error_msg.length
    );

    if (statusCode == PROVER_ERROR_SHORT_BUFFER) {
      Log.d("RapidsnarkModule", "groth16Prove: PROVER_ERROR_SHORT_BUFFER:" + public_buffer_size[0]);
      public_buffer = new byte[(int) public_buffer_size[0]];
      return groth16ProverZkeyFile(rapidsnarkJNI, zkeyPath, wtnsBytes, proof_buffer,
        proof_buffer_size, public_buffer, public_buffer_size, error_msg);
    }
    return statusCode;
  }

  @ReactMethod
  public void groth16_verify(String inputs, String proof, String verificationKey, Promise promise) {
    try {
      boolean proofValid = new RapidsnarkJniBridge().groth16Verifier(inputs, proof, verificationKey);
      promise.resolve(proofValid);
    } catch (Exception e) {
      promise.reject("groth16_verify error", e.getMessage());
    }
  }

  @ReactMethod
  public void calculate_public_buffer_size(String zkeyBytes1, Promise promise) {
    try {
      // Decode base64
      byte[] zkeyBytes = Base64.decode(zkeyBytes1, Base64.DEFAULT);

      int public_buffer_size = (int) (new RapidsnarkJniBridge().calculatePublicBufferSize(zkeyBytes, zkeyBytes.length));

      promise.resolve(public_buffer_size);
    } catch (Exception e) {
      promise.reject("calculate_public_buffer_size error", e.getMessage());
    }
  }
}

class RapidsnarkJniBridge {

  static {
    System.loadLibrary("rapidsnark_module");
  }

  public native int groth16Prover(byte[] zkeyBuffer, long zkeySize,
                                  byte[] wtnsBuffer, long wtnsSize,
                                  byte[] proofBuffer, long[] proofSize,
                                  byte[] publicBuffer, long[] publicSize,
                                  byte[] errorMsg, long errorMsgMaxSize);

  public native int groth16ProverZkeyFile(String zkeyPath,
                                          byte[] wtnsBuffer, long wtnsSize,
                                          byte[] proofBuffer, long[] proofSize,
                                          byte[] publicBuffer, long[] publicSize,
                                          byte[] errorMsg, long errorMsgMaxSize);

  public native boolean groth16Verifier(String inputs, String proof, String verificationKey);

  public native long calculatePublicBufferSize(byte[] zkeyBuffer, long zkeySize);
}
