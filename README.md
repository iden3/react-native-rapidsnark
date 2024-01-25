# react-native-rapidsnark

---

This library is React Native wrapper for the [Rapidsnark](https://github.com/iden3/rapidsnark). It enables the
generation of proofs for specified circuits and witnesses within a React Native environment.

## Platform Support

**iOS**: Compatible with any iOS device with 64 bit architecture.
> Version for emulator built without assembly optimizations, resulting in slower performance.

**Android**: Compatible with arm64-v8a, armeabi-v7a, x86_64 architectures.

## Installation

```sh
npm i @iden3/react-native-rapidsnark
```

## Usage

```js
const rapidsnark = NativeModules.Rapidsnark;

// ...

const {proof, pub_signals} = await rapidsnark.groth16_prover(zkey, wtns);
```

`proof` and `pub_signals` are JSON encoded strings.

### Troubleshooting

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

#### libgroth16_verify.a is not an object file

If you're trying to run package locally, you might get an error like this:

```
error: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/libtool: file: libs_ios/libgroth16_verify.a is not an object file (not allowed in a library)
```
Install [git-lfs](https://git-lfs.com/) and run `git lfs pull` in the root directory to fetch large files.


## Example App

Check out the [example app](./example) for a working example.
To use bundled circuits, install [git-lfs](https://git-lfs.com/) and run `git lfs pull` in the root directory.
To use custom circuits, place your circuit, witness and zkey files in the `example/ios` and `example/android/app/src/main/assets` directory.

## Circuits generation

You can build your own circuits and witnesses to use with example app.

Check out the [circuits](./circuits) directory and [REAMDE.md](./circuits/README.md) inside for more details.

## TODO:

- [x] Add verification.
- [x] Dynamic buffers size. Currently set to 16384 and error 256

## License

react-native-rapidsnark is part of the iden3 project 0KIMS association. Please check the [COPYING](./COPYING) file for
more details.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
