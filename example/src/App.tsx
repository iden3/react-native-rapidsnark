import React from 'react';
import RNFS from "react-native-fs";
import {NativeModules, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const rapidsnark = NativeModules.Rapidsnark;

export default function App() {
  const [proofResult, setProofResult] = React.useState('');
  const [publicResult, setPublicResult] = React.useState('');
  const [execTime, setExecTime] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      console.log('Calling groth16_prover');

      let zkeyF: string;
      let wtnsF: string;
      let verificationKey: string;

      let proof: string;
      let pub_signals: string;

      try {
        if (Platform.OS === 'android') {
          zkeyF = await RNFS.readFileAssets('circuit_final.zkey', 'base64');
          wtnsF = await RNFS.readFileAssets('witness.wtns', 'base64');
          verificationKey = await RNFS.readFileAssets('verification_key.json', 'utf8');
        } else {
          zkeyF = await RNFS.readFile(
            RNFS.MainBundlePath + '/circuit_final.zkey',
            'base64'
          );
          wtnsF = await RNFS.readFile(
            RNFS.MainBundlePath + '/witness.wtns',
            'base64'
          );
          verificationKey = await RNFS.readFile(
            RNFS.MainBundlePath + '/verification_key.json',
            'utf8'
          );
        }

        console.log('zkey f: ', zkeyF.length);
        console.log('wtns f: ', wtnsF.length);
        console.log('vkey f: ', verificationKey.length);

        const startTime = performance.now();

        const proverResult = await rapidsnark.groth16_prover(zkeyF, wtnsF);
        proof = proverResult.proof;
        pub_signals = proverResult.pub_signals;
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
        console.error('Error proving circuit', error);
        return;
      }

      try {
        const startTime = performance.now();

        const result = await rapidsnark.groth16_verify(pub_signals, proof, verificationKey);

        console.log('verification result:' + result);
        const diffVerification = performance.now() - startTime;
        console.log('verification exec time:' + diffVerification);

      } catch (error) {
        console.error('Error verifying proof', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Proof:</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultText} selectable={true}>
            {proofResult}
          </Text>
        </View>
        <Text style={styles.title}>Public inputs:</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultText} selectable={true}>
            {publicResult}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Clipboard.setString(proofResult + publicResult)}
        >
          <Text style={styles.buttonText}>Copy result to clipboard</Text>
        </TouchableOpacity>

        <Text>Execution time: {execTime}ms</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 15,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',

  },
  resultBox: {
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

