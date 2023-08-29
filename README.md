# react-native-rapidsnark

React-native wrapper for rapidsnark

## Installation

```sh
npm install react-native-rapidsnark
```

## Usage

```js
var rapidsnark = NativeModules.Rapidsnark;

// ...

var res = await rapidsnark.groth16_prover(zkey, wtns);
```

## License

This project is licensed under either of

- [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0) ([`LICENSE-APACHE`](LICENSE-APACHE))
- [MIT license](https://opensource.org/licenses/MIT) ([`LICENSE-MIT`](LICENSE-MIT))at your option.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
