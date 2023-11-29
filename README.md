!!! Important project moved to https://github.com/iden3/react-native-rapidsnark

# react-native-rapidsnark

---

This library is React Native wrapper for the [Rapidsnark](https://github.com/iden3/rapidsnark). It enables the generation of proofs for specified circuits and witnesses within a React Native environment.

## Platform Support

**iOS**: Compatible with any iOS device with 64 bit architecture.
> Version for emulator built without assembly optimizations, resulting in slower performance.

**Android**: Compatible with arm64-v8a, armeabi-v7a, x86_64 architectures.

## Installation

```sh
npm install react-native-rapidsnark
```

## Usage

```js
const rapidsnark = NativeModules.Rapidsnark;

// ...

const {proof, pub_signals} = await rapidsnark.groth16_prover(zkey, wtns);
```
`proof` and `pub_signals` are JSON encoded strings.

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

## TODO:
[-]: Add verification.

## License

react-native-rapidsnark is part of the iden3 project 0KIMS association. Please check the [COPYING](./COPYING) file for more details.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
