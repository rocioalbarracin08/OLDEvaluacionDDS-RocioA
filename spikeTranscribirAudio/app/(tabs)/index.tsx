import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <View style={styles.container}>
        <Text>El navegador no soporta reconocimiento de voz</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Micrófono: {listening ? 'Encendido' : 'Apagado'}
      </Text>
      
      <Button title="Empezar" onPress={SpeechRecognition.startListening} />
      <Button title="Detener" onPress={SpeechRecognition.stopListening} />
      <Button title="Resetear" onPress={resetTranscript} />
      
      <Text style={styles.transcript}>{transcript}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  status: {
    fontSize: 18,
    marginBottom: 10,
  },
  transcript: {
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default Dictaphone;