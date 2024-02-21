# react-native-rapidsnark

---

This library is React Native wrapper for the [Rapidsnark](https://github.com/iden3/rapidsnark). It enables the
generation of proofs for specified circuits and witnesses within a React Native environment.

## Platform Support

**iOS**: Compatible with any iOS device with 64 bit architecture.
> Version for emulator built without assembly optimizations, resulting in slower performance.

**Android**: Compatible with arm64-v8a, x86_64 architectures.

## Installation

```sh
npm i @iden3/react-native-rapidsnark
```

## Usage

### Prover

#### groth16_prover

Function that takes zkey and witness files and returns proof and public signals.

`proof` and `pub_signals` are JSON encoded strings.

Large circuits might cause OOM. Use with caution.

```js
import {groth16_prover} from "react-native-rapidsnark";

// ...

const zkey = await RNFS.readFile("path/to/zkey", "base64");
const wtns = await RNFS.readFile("path/to/wtns", "base64");

const {proof, pub_signals} = await groth16_prover(zkey, wtns);
```

#### groth16_prover_zkey_file

Function that takes zkey file path and witness file and returns proof and public signals.

Reads zkey file directly from filesystem, so it's more memory and efficient than `groth16_prover`.

```js
import {groth16_prover_zkey_file} from "react-native-rapidsnark";

// ...

const zkeyPath = "path/to/zkey";
const wtns = await RNFS.readFile("path/to/wtns", "base64");

const {proof, pub_signals} = await groth16_prover_zkey_file(zkeyPath, wtns);
```

### Public buffer size

Both `groth16_prover` and `groth16_prover_zkey_file` has an optional `proofBufferSize`, `publicBufferSize` and `errorBufferSize`  parameters. If publicBufferSize is too small it will be recalculated automatically by library.

These parameters are used to set the size of the buffers used to store the proof, public signals and error.

To calculate the size of public buffer call `groth16_public_size_for_zkey_buf` function and cache it to reuse later.

For file based prover use `groth16_public_size_for_zkey_file`.

#### groth16_public_size_for_zkey_buf

Calculates public buffer size for specified zkey.

```js
import { groth16_public_size_for_zkey_buf, groth16_public_size_for_zkey_file } from "react-native-rapidsnark";

// ...

const zkey = await RNFS.readFile("path/to/zkey", "base64");

const public_buffer_size = await groth16_public_size_for_zkey_buf(zkey);

const public_buffer_size_file = await groth16_public_size_for_zkey_file("path/to/zkey");
```

### Verifier

#### groth16_verifier

Verifies proof and public signals against zkey.

```js
import {groth16_prover, groth16_verifier} from "react-native-rapidsnark";

// ...

const zkey = await RNFS.readFile("path/to/zkey", "base64");
const wtns = await RNFS.readFile("path/to/wtns", "base64");
const verificationKey = await RNFS.readFile("path/to/verification_key", "base64");

const {proof, pub_signals} = await groth16_prover(zkey, wtns);

const proofValid = groth16_verifier(proof, pub_signals, verificationKey);
```

## Troubleshooting

### Errors

#### Invalid witness length.

If you're getting invalid witness length error - check that your witness file is not corrupted and is generated for the same circuit as zkey.

#### iOS linking troubleshooting

If you get an error like this:

```
building for 'iOS-simulator', but linking in object file (${SRC_ROOT}/ios/Frameworks/Rapidsnark.xcframework/ios-arm64/librapidsnarkmerged.a[2](fq.o)) built for 'iOS'
```

1. Open XCode
2. Select your project in the left sidebar
3. Select `Build Phases` tab
4. Expand `Link Binary With Libraries`
5. Add `RapidSnark.xcframework` from `Workspace/Pods` folder.


## Example App

Check out the [example app](./example) and [example README](./example/README.md) for a working example.

To setup the example app, call
```bash
yarn install && yarn pods
```

in the [`example`](./example) directory.

#### iOS

```bash
yarn ios
```

#### Android

```bash
yarn android
```

## Circuits

Zkey, witness and verification key files should be named:
- `circuit.zkey`
- `witness.wtns`
- `verification_key.json`

### Custom circuits

To use custom circuits, place your circuit, witness and zkey files in the [`example/ios`](./example/ios) for iOS and to [`example/android/app/src/main/assets`](./example/android/app/src/main/assets) for Android.

Or put these files in the [`example`](./example) folder and call [`example/scripts/copy_assets.sh`](./example/scripts/copy_assets.sh) to copy them to the correct location.

### Circuits generation

You can build your own circuits and witnesses to use with example app.

Check out the [circuits](./circuits) directory and [REAMDE.md](./circuits/README.md) inside for more details.

## License

react-native-rapidsnark is part of the iden3 project 0KIMS association. Please check the [COPYING](./COPYING) file for
more details.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
