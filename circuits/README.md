### MacOS Setup

1. Requires Homebrew (https://brew.sh/) and Node.
2. Install dependencies:

```shell
brew install wget
```

3. Install [circom](https://github.com/iden3/circom).
4. Install [snarkjs](https://github.com/iden3/snarkjs). Node 18 might be required, use [n](https://www.npmjs.com/package/n/v/5.0.1) or other Node manager.
4.1. If you want to test inputs - place `input.json` file in internal `circuits` dir.
5. Run `./scripts/build.sh` to generate the circuit and witness files, prove and verify circuit with given `input.json`.

Current `circuit.circom` is taken from [iden3/circuits](https://github.com/iden3/circuits/blob/master/test/circuits/authV2Test.circom) repo.
Current `input.json` is taken from [iden3/circuits](https://github.com/iden3/circuits/blob/master/test/auth/authV2.test.ts) test.

