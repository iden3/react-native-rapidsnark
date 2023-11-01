import * as React from 'react';
import RNFS from 'react-native-fs';

import { Platform, StyleSheet, View, Text, Button } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeModules } from 'react-native';
// import zkey from './circuit_final.zkey';
// import wtns from './witness.wtns';
// var zkey = require('../circuit_final.zkey');
// var wtns = require('../witness.wtns');
import base64 from 'base-64';

let rapidsnark = NativeModules.Rapidsnark;

export default function App() {
  const [result, setResult] = React.useState('');
  const [execTime, setExecTime] = React.useState(0);

  //   async function getFileBytes(fp) {
  //     // Path to the embedded file in your app
  //     const filePath = RNFS.MainBundlePath + fp;

  //     try {
  //         const fileContent = await RNFS.readFile(filePath, 'base64');
  //         // Now, fileContent contains the content of the file in base64 format
  //         // You can then convert this to bytes if needed or pass to your function directly
  //         return fileContent;
  //     } catch (error) {
  //         console.error("Error reading file:", error);
  //     }
  // }

  React.useEffect(() => {
    console.log('Calling groth16_prover');
    // console.log("zkey: ", zkey);
    const fetchData = async () => {
      try {
        // const zkeyFile = await Asset.loadAsync('./circuit_final.zkey');
        // const wtnsFile = await Asset.loadAsync('./witness.wtns');

        // console.log(fileContent);
        // Process the content as needed, or pass it to another function

        // var zkeyBytes = await getFileBytes('./circuit_final.zkey');
        // var wtnsBytes = await getFileBytes('./witness.wtns');
        // console.log("zkey: ", zkey);
        // console.log("zkey bytes: ", zkey.asBytes().length);
        // console.log("wtns: ", wtns.length);
        //
        // RNFS.readDir(RNFS.MainBundlePath)
        // .then(files => {
        //   console.log(files);
        // })
        // .catch(error => {
        //   console.error(error);
        // });

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
        // var zkeyFdecoded = base64.decode(zkeyF);
        // var wtnsFdecoded = base64.decode(wtnsF);
        // var uint8array = Uint8Array.from(zkeyFdecoded);

        // console.log("zkey f decoded: ", zkeyFdecoded.length);
        // console.log("zkey decoded type of", typeof zkeyFdecoded);

        // 30613844
        // 22960382
        // 32181722

        // var array = new Uint8Array(new ArrayBuffer(zkeyFdecoded.length));
        // for(let i = 0; i < zkeyFdecoded.length; i++) {
        //     array[i] = zkeyFdecoded.charCodeAt(i);
        // }
        // console.log("zkey zkeyFdecoded decoded: ", array.length);
        // console.log("zkey zkeyFdecoded type of", typeof array);

        // var arrayw = new Uint8Array(new ArrayBuffer(wtnsFdecoded.length));

        // for(let i = 0; i < wtnsFdecoded.length; i++) {
        //   arrayw[i] = wtnsFdecoded.charCodeAt(i);
        // }
        // console.log("zkey arrayw decoded: ", arrayw.length);
        // console.log("zkey arrayw type of", typeof arrayw);

        const startTime = performance.now();

        const {proof, pub} = await rapidsnark.groth16_prover(zkeyF, wtnsF);
        console.log('res: ', proof, pub);

        setResult(proof);

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
      <Text selectable={true}>{result}</Text>
      <Text>Execution time: {execTime}ms</Text>
      <Button
        onPress={() => Clipboard.setString(proof)}
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
