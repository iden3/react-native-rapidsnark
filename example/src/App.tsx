import React from 'react';
import RNFS from "react-native-fs";
import {Button, NativeModules, Platform, StyleSheet, Text, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const rapidsnark = NativeModules.Rapidsnark;

export default function App() {
  const [proofResult, setProofResult] = React.useState('');
  const [publicResult, setPublicResult] = React.useState('');
  const [execTime, setExecTime] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      console.log('Calling groth16_prover');
      try {
        let zkeyF: string;
        let wtnsF: string;
        if (Platform.OS === 'android') {
          zkeyF = await RNFS.readFileAssets('circuit_final.zkey', 'base64');
          wtnsF = await RNFS.readFileAssets('witness.wtns', 'base64');
        } else {
          zkeyF = await RNFS.readFile(
            RNFS.MainBundlePath + '/circuit_final.zkey',
            'base64'
          );
          wtnsF = await RNFS.readFile(
            RNFS.MainBundlePath + '/witness.wtns',
            'base64'
          );
        }

        console.log('zkey f: ', zkeyF.length);

        const startTime = performance.now();

        const {proof, pub_signals} = await rapidsnark.groth16_prover(zkeyF, wtnsF);
        console.log('proofResult: ', proof);
        console.log('publicResult: ', pub_signals);

        const formattedProof = JSON.stringify(JSON.parse(proof), null, '\t');
        const formattedSignals = JSON.stringify(JSON.parse(pub_signals), null, '\t');

        console.log('formattedProof: ', formattedProof);
        console.log('formattedSignals: ', formattedSignals);

        setProofResult(formattedProof);
        setPublicResult(pub_signals);

        const diff = performance.now() - startTime;
        setExecTime(diff);
        console.log('exec time ' + diff + 'ms');
      } catch (error) {
        console.error('Error reading file', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result</Text>
      <Text selectable={true}>{proofResult}</Text>
      <Text>Public result</Text>
      <Text selectable={true}>{publicResult}</Text>
      <Text>Execution time: {execTime}ms</Text>
      <Button
        onPress={() => Clipboard.setString(proofResult)}
        title="Copy result to clipboard"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
