import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function TituloEquivocate() {
  return (
    <Text style={estilos.titulo}>Equivocate</Text>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    fontSize: 34,
    letterSpacing: 10,
    color: '#c8b89a',
    textTransform: 'uppercase',
    marginBottom: 32,
    opacity: 0.85,
    fontWeight: '400',
  },
});