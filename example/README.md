
## Example

Before running the example app, you need to compile test circuit, and copy necessary files to the example app.
```bash
cd circuits/scripts &&
yarn install &&
./build.sh &&
./copy_to_example.sh &&
cd ../..
```

To setup the example app, call
```bash
yarn install && yarn pods
```

Also run `yarn install` in the root folder to install dependencies for the lib as it is not packed.

#### iOS

```bash
yarn ios
```

#### Android

```bash
yarn android
```

### Custom circuits

To use custom circuits, place your circuit, witness and zkey files in the [`ios`](./ios) for iOS and to [`android/app/src/main/assets`](./android/app/src/main/assets) for Android.

Or put these files in the [`example`](.) root folder and call [`scripts/copy_assets.sh`](./scripts/copy_assets.sh) to copy them to the correct location.

### Circuits generation

You can build your own circuits and witnesses to use with example app. [`Circom`](https://docs.circom.io)

#### MacOS Setup

1. Requires [Homebrew](https://brew.sh/) and Node.
2. Install [circom](https://github.com/iden3/circom).
3. Install [snarkjs](https://github.com/iden3/snarkjs). In case of errors try using Node 18 with [n](https://www.npmjs.com/package/n/v/5.0.1) or other version manager.
  1. If you want to test inputs - place `input.json` file in internal `circuits` dir.
4. Run [`./circuits/scripts/build.sh`](./circuits/scripts/build.sh) to generate the circuit and witness files, prove and verify circuit with given `input.json`.
5. Run [`./circuits/scripts/copy_to_example.sh`](./circuits/scripts/copy_to_example.sh) to update example app with new circuit and witness files.

`circuits` folder is taken from [iden3/circuits](https://github.com/iden3/circuits/blob/master/test/circuits/authV2Test.circom) repo.

`circuits/input.json` is taken from [iden3/circuits](https://github.com/iden3/circuits/blob/master/test/auth/authV2.test.ts) test, line 10.

