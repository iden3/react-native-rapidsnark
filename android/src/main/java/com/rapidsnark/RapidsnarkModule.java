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
  public void groth16Prove(String zkeyPath, String wtnsBytes1,
                                           Integer proofBufferSize, Integer publicBufferSize,
                                           Integer errorBufferSize,
                                           Promise promise) {
    try {
      // Decode base64
      byte[] wtnsBytes = Base64.decode(wtnsBytes1, Base64.DEFAULT);

      ProveResponse response = RapidsnarkKt.groth16Prove(
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
  public void groth16PublicBufferSize(String zkeyPath, Integer errorBufferSize, Promise promise) {
    try {
      int publicBufferSize = RapidsnarkKt.groth16PublicBufferSize(
        zkeyPath,
        errorBufferSize
      );

      promise.resolve(publicBufferSize);
    } catch (RapidsnarkError e) {
      promise.reject(String.valueOf(e.getCode()), e.getMessage());
    }
  }
}
