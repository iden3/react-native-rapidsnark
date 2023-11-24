import {NativeModules, Platform} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-rapidsnark' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Rapidsnark = NativeModules.Rapidsnark
  ? NativeModules.Rapidsnark
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

export function groth16_prover(zkey: string, witness: string): Promise<number> {
  return Rapidsnark.groth16_prover(zkey, witness);
}
