import React from 'react';
import RNFS from 'react-native-fs';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {groth16Prove, groth16PublicBufferSize, groth16Verify} from '@iden3/react-native-rapidsnark';

export default function App() {
  const [proofResult, setProofResult] = React.useState('');
  const [publicResult, setPublicResult] = React.useState('');
  const [proofExecTime, setProofExecTime] = React.useState(0);
  const [bufferCalcExecTime, setBufferCalcExecTime] = React.useState(0);
  const [bufferSize, setBufferSize] = React.useState(0);
  const [verificationResult, setVerificationResult] = React.useState<
    boolean | null
  >(null);
  const [verificationExecTime, setVerificationExecTime] = React.useState(0);

  // groth16 prover with reading zkey from C++ library.
  // this function has better performance than groth16_prover
  const runGroth16Prover = async () => {
    console.log('Calling useGroth16FileProver');

    const wtnsF = await getWtnsFile();

    const startTime = performance.now();
    try {
      const proverResult = await groth16Prove(zkeyPath, wtnsF);
      const diff = performance.now() - startTime;
      setProofExecTime(diff);
      return proverResult;
    } catch (e) {
      console.error('Error creating proof', e);
      throw e;
    }
  };

  const logProof = ({
                      proof,
                      pub_signals,
                    }: {
    proof: string;
    pub_signals: string;
  }) => {
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
    console.log('Calling groth16Prove');

    // Copy assets to documents directory on Android
    if (Platform.OS === 'android') {
      await writeAssetFilesToDocumentsDirectory();
    }

    let proverResult: { proof: string; pub_signals: string };

    // Generate proof
    try {
      proverResult = await runGroth16Prover();

      logProof(proverResult);
      setProofResult(proverResult.proof);
      setPublicResult(proverResult.pub_signals);
    } catch (error: any) {
      console.error(
        'Error proving circuit, code: ',
        error.code,
        ', err:',
        error.message,
      );
      return;
    }

    // Verify proof
    try {
      const verificationKey = await getVerificationKeyFile();

      const startTime = performance.now();
      const result = await groth16Verify(
        proverResult.proof,
        proverResult.pub_signals,
        verificationKey,
      );
      const diffVerification = performance.now() - startTime;

      setVerificationResult(result);
      setVerificationExecTime(diffVerification);
      console.log('verification result proof valid:' + result);
      console.log('verification exec time:' + diffVerification);
    } catch (error) {
      console.error('Error verifying proof', error);
    }
  }, []);

  const calculateBufferSize = React.useCallback(async () => {
    console.log('Calling groth16PublicSizeForZkeyFile');

    const startTime = performance.now();
    const publicBufferSize = await groth16PublicBufferSize(zkeyPath);
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
          onPress={() => calculateBufferSize()}>
          <Text style={styles.buttonText}>Calc. input buffer size</Text>
        </TouchableOpacity>
        <Text style={styles.resultText}>
          Buffer calc execution time: {bufferCalcExecTime}ms
        </Text>
        <Text style={styles.resultText}>Buffer: {bufferSize} bytes</Text>

        <View style={{height: 20}}/>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Clipboard.setString(proofResult + '\n' + publicResult)
          }>
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
      'circuit.zkey',
      RNFS.DocumentDirectoryPath + '/circuit.zkey',
    ),
    RNFS.copyFileAssets(
      'witness.wtns',
      RNFS.DocumentDirectoryPath + '/witness.wtns',
    ),
    RNFS.copyFileAssets(
      'verification_key.json',
      RNFS.DocumentDirectoryPath + '/verification_key.json',
    ),
  ]);
}

const zkeyPath =
  (Platform.OS === 'android'
    ? RNFS.DocumentDirectoryPath
    : RNFS.MainBundlePath) + '/circuit.zkey';

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
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
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
