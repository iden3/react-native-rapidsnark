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
    RapidsnarkJniBridge rapidsnarkJNI = new RapidsnarkJniBridge();

    long startTime = System.currentTimeMillis(); // Capture start time

    // Decode base64
    byte[] zkeyBytes = Base64.decode(zkeyBytes1, Base64.DEFAULT);
    byte[] wtnsBytes = Base64.decode(wtnsBytes1, Base64.DEFAULT);

    // Create buffers to get results
    byte[] proof_buffer = new byte[proofBufferSize];
    long[] proof_buffer_size = new long[]{proofBufferSize};
    byte[] public_buffer = new byte[publicBufferSize];
    long[] public_buffer_size = new long[]{publicBufferSize};
    byte[] error_msg = new byte[errorBufferSize];

    try {
      // This will require you to write a JNI bridge to your C library.
      int statusCode = rapidsnarkJNI.groth16Prover(
        zkeyBytes, zkeyBytes.length,
        wtnsBytes, wtnsBytes.length,
        proof_buffer, proof_buffer_size,
        public_buffer, public_buffer_size,
        error_msg, error_msg.length
      );
      if (statusCode == PROVER_ERROR_SHORT_BUFFER) {
        public_buffer = new byte[(int) public_buffer_size[0]];

        statusCode = rapidsnarkJNI.groth16Prover(
          zkeyBytes, zkeyBytes.length,
          wtnsBytes, wtnsBytes.length,
          proof_buffer, proof_buffer_size,
          public_buffer, public_buffer_size,
          error_msg, error_msg.length
        );
      }

      long endTime = System.currentTimeMillis(); // Capture end time
      long executionTime = endTime - startTime;

      // Convert byte arrays to strings
      String proofResult = new String(proof_buffer, StandardCharsets.UTF_8).trim();
      String publicResult = new String(public_buffer, StandardCharsets.UTF_8).trim();

      if (!proofResult.isEmpty()) {
        HashMap<String, String> result = new HashMap<>();
        result.put("proof", proofResult);
        result.put("pub_signals", publicResult);

        WritableMap map = new WritableNativeMap();
        for (Map.Entry<String, String> entry : result.entrySet()) {
          map.putString(entry.getKey(), entry.getValue());
        }

        promise.resolve(map);
      } else {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        promise.reject("PROVER_ERROR", errorString);
      }
    } catch (Exception e) {
      promise.reject("PROVER_ERROR", e.getMessage());
    }
  }

  @ReactMethod
  public void groth16_prover_zkey_file(String zkeyPath, String wtnsBytes1,
                                       Integer proofBufferSize, Integer publicBufferSize,
                                       Integer errorBufferSize,
                                       Promise promise) {
    RapidsnarkJniBridge rapidsnarkJNI = new RapidsnarkJniBridge();

    long startTime = System.currentTimeMillis(); // Capture start time

    // Decode base64
    byte[] wtnsBytes = Base64.decode(wtnsBytes1, Base64.DEFAULT);

    // Create buffers to get results
    byte[] proof_buffer = new byte[proofBufferSize];
    long[] proof_buffer_size = new long[]{proofBufferSize};
    byte[] public_buffer = new byte[publicBufferSize];
    long[] public_buffer_size = new long[]{publicBufferSize};
    byte[] error_msg = new byte[errorBufferSize];

    try {
      // This will require you to write a JNI bridge to your C library.
      int statusCode = rapidsnarkJNI.groth16ProverZkeyFile(
        zkeyPath,
        wtnsBytes, wtnsBytes.length,
        proof_buffer, proof_buffer_size,
        public_buffer, public_buffer_size,
        error_msg, error_msg.length
      );

      if (statusCode == PROVER_ERROR_SHORT_BUFFER) {
        // public_buffer_size is updated at lib side with needed size
        public_buffer = new byte[(int) public_buffer_size[0]];

        statusCode = rapidsnarkJNI.groth16ProverZkeyFile(
          zkeyPath,
          wtnsBytes, wtnsBytes.length,
          proof_buffer, proof_buffer_size,
          public_buffer, public_buffer_size,
          error_msg, error_msg.length
        );
      }

      long endTime = System.currentTimeMillis(); // Capture end time
      long executionTime = endTime - startTime;

      // Convert byte arrays to strings
      String proofResult = new String(proof_buffer, StandardCharsets.UTF_8).trim();
      String publicResult = new String(public_buffer, StandardCharsets.UTF_8).trim();

      if (!proofResult.isEmpty()) {
        HashMap<String, String> result = new HashMap<>();
        result.put("proof", proofResult);
        result.put("pub_signals", publicResult);

        WritableMap map = new WritableNativeMap();
        for (Map.Entry<String, String> entry : result.entrySet()) {
          map.putString(entry.getKey(), entry.getValue());
        }

        promise.resolve(map);
      } else {
        String errorString = new String(error_msg, StandardCharsets.UTF_8);
        promise.reject("PROVER_ERROR", errorString);
      }
    } catch (Exception e) {
      promise.reject("PROVER_ERROR", e.getMessage());
    }
  }

  @ReactMethod
  public void groth16_verify(String inputs, String proof, String verificationKey, Promise promise) {
    try {
      boolean result = new RapidsnarkJniBridge().groth16Verifier(inputs, proof, verificationKey);
      promise.resolve(result);
    } catch (Exception e) {
      promise.reject("VERIFIER_ERROR", e.getMessage());
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
      promise.reject("", e.getMessage());
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
