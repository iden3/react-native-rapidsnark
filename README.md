# react-native-rapidsnark

---

This library is React Native wrapper for the [Rapidsnark](https://github.com/iden3/rapidsnark). It enables the
generation of proofs for specified circuits within a React Native environment.

## Platform Support

**iOS**: Compatible with any iOS device with 64 bit architecture.
> Version for emulator built without assembly optimizations, resulting in slower performance.

**Android**: Compatible with arm64-v8a, x86_64 architectures.

## Installation

```sh
npm i @iden3/react-native-rapidsnark
```

## Usage

#### groth16Prove

Function takes path to .zkey file and witness file (base64 encoded) and returns proof and public signals.

Reads .zkey file directly from filesystem.


```js
import {groth16Prove} from "react-native-rapidsnark";

// ...

const zkeyPath = "path/to/zkey";
const wtns = await RNFS.readFile("path/to/wtns", "base64");

const {proof, pub_signals} = await groth16Prove(zkeyPath, wtns);
```

#### groth16Verify

Verifies proof and public signals against zkey.

```js
import {groth16Prove, groth16Verify} from "react-native-rapidsnark";

// ...

const zkey = await RNFS.readFile("path/to/zkey", "base64");
const wtns = await RNFS.readFile("path/to/wtns", "base64");
const verificationKey = await RNFS.readFile("path/to/verification_key", "base64");

const {proof, pub_signals} = await groth16Prove(zkey, wtns);

const proofValid = groth16Verify(proof, pub_signals, verificationKey);
```

#### groth16PublicBufferSize

Calculates public buffer size for specified zkey.

```js
import { groth16PublicBufferSize } from "react-native-rapidsnark";

// ...

const public_buffer_size_file = await groth16PublicBufferSize("path/to/zkey");
```

### Public buffer size

`groth16Prove` has an optional `proofBufferSize`, `publicBufferSize` and `errorBufferSize`  parameters. If publicBufferSize is too small it will be recalculated automatically by library.

These parameters are used to set the size of the buffers used to store the proof, public signals and error.

If you have embedded circuit in the app, it is recommended to calculate the size of the public buffer once and reuse it.
To calculate the size of public buffer call `groth16PublicBufferSize`.

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
5. Add `Rapidsnark.xcframework` from `Workspace/Pods` folder.

## Example App

Check out the [example app](./example) and [example README](./example/README.md) for a working example.

### Circuits generation

Check out the [example/circuits](./example/circuits) directory and [example REAMDE.md](./example/README.md) inside for more details.

## License

react-native-rapidsnark is part of the iden3 project 0KIMS association. Please check the [COPYING](./COPYING) file for
more details.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
