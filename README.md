# react-native-rapidsnark

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/react-native-rapidsnark.svg)](https://badge.fury.io/js/react-native-rapidsnark)

React Native wrapper for rapidsnark prover library.
Currently only supports groth16 prover.

## Installation

```sh
npm install react-native-rapidsnark
```

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

## Usage

```js
const rapidsnark = NativeModules.Rapidsnark;

// ...

const res = await rapidsnark.groth16_prover(zkey, wtns);
```

## License

This project is licensed under either of

- [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0) ([`LICENSE-APACHE`](LICENSE-APACHE))
- [MIT license](https://opensource.org/licenses/MIT) ([`LICENSE-MIT`](LICENSE-MIT))at your option.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
