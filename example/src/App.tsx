import React from 'react';
import RNFS from 'react-native-fs';
import {Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View,} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  groth16_prover,
  groth16_prover_zkey_file,
  groth16_public_size_for_zkey_file,
  groth16_verifier,
} from '../../src';

export default function App() {
  const [enableBufferProver, setEnableBufferProver] = React.useState(false);
  const [proofResult, setProofResult] = React.useState('');
  const [publicResult, setPublicResult] = React.useState('');
  const [proofExecTime, setProofExecTime] = React.useState(0);
  const [bufferCalcExecTime, setBufferCalcExecTime] = React.useState(0);
  const [bufferSize, setBufferSize] = React.useState(0);
  const [verificationResult, setVerificationResult] =
    React.useState<boolean>(null);
  const [verificationExecTime, setVerificationExecTime] = React.useState(0);

  const onToggleSwitch = () => setEnableBufferProver(!enableBufferProver);

  // groth16 prover with reading zkey from buffer.
  // this function in React Native is limited, not applicable for
  // large files. It is better to use groth16_prover_zkey_file
  const runGroth16BufferProver = async () => {
    console.log('Calling useGroth16BufferProver');

    const zkeyF = await getZkeyFile();
    const wtnsF = await getWtnsFile();
    console.log('zkeyF: ', zkeyF.length);
    console.log('wtnsF: ', wtnsF.length);

    const startTime = performance.now();
    const proverResult = await groth16_prover(zkeyF, wtnsF);
    const diff = performance.now() - startTime;
    setProofExecTime(diff);

    return proverResult;
  };

  // groth16 prover with reading zkey from C++ library.
  // this function has better performance than groth16_prover
  const runGroth16FileProver = async () => {
    console.log('Calling useGroth16FileProver');

    const wtnsF = await getWtnsFile();

    const startTime = performance.now();
    const proverResult = await groth16_prover_zkey_file(zkeyPath, wtnsF);
    const diff = performance.now() - startTime;
    setProofExecTime(diff);
    return proverResult;
  };

  const logProof = ({proof, pub_signals}) => {
    console.log('proofResult: ', proof);
    console.log('publicResult: ', pub_signals);

    const formattedProof = JSON.stringify(JSON.parse(proof), null, '\t');
    const formattedSignals = JSON.stringify(
      JSON.parse(pub_signals),
      null,
      '\t'
    );

    console.log('formattedProof: ', formattedProof);
    console.log('formattedSignals: ', formattedSignals);
  };

  const runProver = React.useCallback(async () => {
    console.log('Calling groth16_prover');

    // Copy assets to documents directory on Android
    if (Platform.OS === 'android') {
      await writeAssetFilesToDocumentsDirectory();
    }

    let proverResult: { proof: string; pub_signals: string };

    // Generate proof
    try {
      if (enableBufferProver) {
        proverResult = await runGroth16BufferProver();
      } else {
        proverResult = await runGroth16FileProver();
      }

      logProof(proverResult);
      setProofResult(proverResult.proof);
      setPublicResult(proverResult.pub_signals);
    } catch (error) {
      console.error(
        'Error proving circuit, code: ',
        error.code,
        ', err:',
        error.message
      );
      return;
    }

    // Verify proof
    try {
      const verificationKey = await getVerificationKeyFile();

      const startTime = performance.now();
      const result = await groth16_verifier(
        proverResult.proof,
        proverResult.pub_signals,
        verificationKey
      );
      const diffVerification = performance.now() - startTime;

      setVerificationResult(result);
      setVerificationExecTime(diffVerification);
      console.log('verification result proof valid:' + result);
      console.log('verification exec time:' + diffVerification);
    } catch (error) {
      console.error('Error verifying proof', error);
    }
  }, [enableBufferProver]);

  const calculateBufferSize = React.useCallback(async () => {
    console.log('Calling groth16_public_size_for_zkey_file');

    const startTime = performance.now();
    const publicBufferSize = await groth16_public_size_for_zkey_file(zkeyPath);
    const diff = performance.now() - startTime;

    setBufferCalcExecTime(diff);
    console.log('publicBufferSize exec: ', diff);
    setBufferSize(publicBufferSize);
    console.log('publicBufferSize: ', publicBufferSize);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={{height: 40}}/>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          <Switch value={enableBufferProver} onValueChange={onToggleSwitch}/>
          <View style={{width: 10}}/>
          <Text style={styles.resultText}>Enable buffer prover</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => runProver()}>
          <Text style={styles.buttonText}>Run prover</Text>
        </TouchableOpacity>

        <View style={{height: 20}}/>

        <Text style={styles.resultText}>Execution time: {proofExecTime}ms</Text>
        <Text style={styles.resultText}>
          Proof valid: {verificationResult?.toString() ?? 'checking'}
        </Text>
        <Text style={styles.resultText}>
          Verification exec: {verificationExecTime}ms
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => calculateBufferSize()}
        >
          <Text style={styles.buttonText}>Calc. input buffer size</Text>
        </TouchableOpacity>
        <Text style={styles.resultText}>
          Buffer calc execution time: {bufferCalcExecTime}ms
        </Text>
        <Text style={styles.resultText}>Buffer: {bufferSize} bytes</Text>

        <View style={{height: 20}}/>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Clipboard.setString(proofResult + '\n' + publicResult)}
        >
          <Text style={styles.buttonText}>Copy result to clipboard</Text>
        </TouchableOpacity>

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

        <View style={{height: 20}}/>
      </ScrollView>
    </View>
  );
}

function writeAssetFilesToDocumentsDirectory(): Promise<any> {
  return Promise.all([
    RNFS.copyFileAssets(
      'circuit_final.zkey',
      RNFS.DocumentDirectoryPath + '/circuit_final.zkey'
    ),
    RNFS.copyFileAssets(
      'witness.wtns',
      RNFS.DocumentDirectoryPath + '/witness.wtns'
    ),
    RNFS.copyFileAssets(
      'verification_key.json',
      RNFS.DocumentDirectoryPath + '/verification_key.json'
    ),
  ]);
}

const zkeyPath =
  (Platform.OS === 'android'
    ? RNFS.DocumentDirectoryPath
    : RNFS.MainBundlePath) + '/circuit.zkey';

function getZkeyFile(): Promise<string> {
  return RNFS.readFile(zkeyPath, 'base64');
}

function getWtnsFile(): Promise<string> {
  const path =
    (Platform.OS === 'android'
      ? RNFS.DocumentDirectoryPath
      : RNFS.MainBundlePath) + '/witness.wtns';
  return RNFS.readFile(path, 'base64');
}

function getVerificationKeyFile(): Promise<string> {
  const path =
    (Platform.OS === 'android'
      ? RNFS.DocumentDirectoryPath
      : RNFS.MainBundlePath) + '/verification_key.json';
  return RNFS.readFile(path, 'utf8');
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
