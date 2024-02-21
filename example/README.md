
## Example

To setup the example app, call
```bash
yarn install && yarn pods
```

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

You can build your own circuits and witnesses to use with example app.

Check out the [circuits](../circuits) directory and [README.md](../circuits/README.md) inside for more details.
