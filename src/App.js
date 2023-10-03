import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Voice from '@react-native-voice/voice'; // You will need to install this package

const App = () => {
  const [voiceState, setVoiceState] = useState('waiting');
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentParameters, setCurrentParameters] = useState('');
  const [speechDetected, setSpeechDetected] = useState('');
  const [dataOutputs, setDataOutputs] = useState([]);

  useEffect(() => {
    // Initialize voice recognition
    Voice.onSpeechStart = () => setVoiceState('listening');
    Voice.onSpeechRecognized = (e) => setSpeechDetected(e.value);
    Voice.onSpeechEnd = () => setVoiceState('waiting');
    Voice.onSpeechError = (e) => console.log('Speech error:', e);
    Voice.onSpeechResults = (e) => handleVoiceResults(e.value);
    
    // Start listening for voice commands
    Voice.start('en-US');
    
    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);

  const handleVoiceResults = (results) => {
    const command = results[0].toLowerCase();
    
    if (voiceState === 'waiting') {
      // Ignore commands when not in listening state
      return;
    }

    if (command.startsWith('code')) {
      const parameters = command.substring(4).trim();
      if (/^[0-9 ]+$/.test(parameters)) {
        // Valid parameters
        setCurrentCommand('code');
        setCurrentParameters(parameters);
        setDataOutputs([...dataOutputs, { command: 'code', value: parameters }]);
      }
    } else if (command.startsWith('count')) {
      const parameters = command.substring(5).trim();
      if (/^[0-9 ]+$/.test(parameters)) {
        // Valid parameters
        setCurrentCommand('count');
        setCurrentParameters(parameters);
        setDataOutputs([...dataOutputs, { command: 'count', value: parameters }]);
      }
    } else if (command === 'reset') {
      setCurrentCommand('reset');
      setCurrentParameters('');
    } else if (command === 'back') {
      // Implement undo functionality here (remove the last data entry)
    } else {
      // Handle unrecognized commands
    }
  };

  return (
    <View>
      <Text>Voice Module State: {voiceState}</Text>
      <Text>Current Command: {currentCommand}</Text>
      <Text>Current Parameters: {currentParameters}</Text>
      <Text>Speech Detected: {speechDetected}</Text>
      <View>
        <Text>Data Outputs:</Text>
        {dataOutputs.map((output, index) => (
          <Text key={index}>
            {`{ "command": "${output.command}", "value": "${output.value}" }`}
          </Text>
        ))}
      </View>
      <TouchableOpacity onPress={() => handleBackCommand()}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
