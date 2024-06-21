package com.rapidsnark;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;

import android.util.Base64;

import io.iden3.rapidsnark.ProveResponse;
import io.iden3.rapidsnark.RapidsnarkError;
import io.iden3.rapidsnark.RapidsnarkKt;


@ReactModule(name = RapidsnarkModule.NAME)
public class RapidsnarkModule extends ReactContextBaseJavaModule {
  public static final String NAME = "Rapidsnark";

  public RapidsnarkModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void groth16Prove(String zkeyBytes1, String wtnsBytes1,
                           Integer proofBufferSize, Integer publicBufferSize,
                           Integer errorBufferSize,
                           Promise promise) {
    try {
      // Decode base64
      byte[] zkeyBytes = Base64.decode(zkeyBytes1, Base64.DEFAULT);
      byte[] wtnsBytes = Base64.decode(wtnsBytes1, Base64.DEFAULT);

      ProveResponse response = RapidsnarkKt.groth16Prove(
        zkeyBytes,
        wtnsBytes,
        proofBufferSize,
        publicBufferSize,
        errorBufferSize
      );

      WritableMap result = new WritableNativeMap();
      result.putString("proof", response.getProof());
      result.putString("pub_signals", response.getPublicSignals());

      promise.resolve(result);
    } catch (RapidsnarkError e) {
      promise.reject(String.valueOf(e.getCode()), e.getMessage());
    }
  }

  @ReactMethod
  public void groth16ProveWithZKeyFilePath(String zkeyPath, String wtnsBytes1,
                                           Integer proofBufferSize, Integer publicBufferSize,
                                           Integer errorBufferSize,
                                           Promise promise) {
    try {
      // Decode base64
      byte[] wtnsBytes = Base64.decode(wtnsBytes1, Base64.DEFAULT);

      ProveResponse response = RapidsnarkKt.groth16ProveWithZKeyFilePath(
        zkeyPath,
        wtnsBytes,
        proofBufferSize,
        publicBufferSize,
        errorBufferSize
      );

      WritableMap result = new WritableNativeMap();
      result.putString("proof", response.getProof());
      result.putString("pub_signals", response.getPublicSignals());

      promise.resolve(result);
    } catch (RapidsnarkError e) {
      promise.reject(String.valueOf(e.getCode()), e.getMessage());
    }
  }

  @ReactMethod
  public void groth16Verify(String proof, String inputs, String verificationKey,
                            Integer errorBufferSize, Promise promise) {
    try {
      boolean result = RapidsnarkKt.groth16Verify(
        proof,
        inputs,
        verificationKey,
        errorBufferSize
      );

      promise.resolve(result);
    } catch (RapidsnarkError e) {
      promise.reject(String.valueOf(e.getCode()), e.getMessage());
    }
  }

  @ReactMethod
  public void groth16PublicSizeForZkeyBuf(String zkeyBytes1, Integer errorBufferSize, Promise promise) {
    try {
      int publicBufferSize = RapidsnarkKt.groth16PublicSizeForZkeyBuf(
        zkeyBytes1,
        errorBufferSize
      );

      promise.resolve(publicBufferSize);
    } catch (RapidsnarkError e) {
      promise.reject(String.valueOf(e.getCode()), e.getMessage());
    }
  }

  @ReactMethod
  public void groth16PublicSizeForZkeyFile(String zkeyPath, Integer errorBufferSize, Promise promise) {
    try {
      int publicBufferSize = RapidsnarkKt.groth16PublicSizeForZkeyFile(
        zkeyPath,
        errorBufferSize
      );

      promise.resolve(publicBufferSize);
    } catch (RapidsnarkError e) {
      promise.reject(String.valueOf(e.getCode()), e.getMessage());
    }
  }
}
