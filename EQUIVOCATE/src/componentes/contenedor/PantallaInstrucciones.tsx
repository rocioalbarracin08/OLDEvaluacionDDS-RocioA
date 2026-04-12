import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PropiedadesPantallaInstrucciones {
  onComenzar: () => void;
}

export function PantallaInstrucciones({ onComenzar }: PropiedadesPantallaInstrucciones) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.instruccion}>
        Decí letras en voz alta para ver el poema.
      </Text>
      <Text style={estilos.instruccion}>
        No pronuncies las letras que están alrededor.
      </Text>
      <Text style={estilos.instruccion}>
        Si te callás, tenés 5 segundos antes de perder todo.
      </Text>
      <TouchableOpacity style={estilos.boton} onPress={onComenzar} activeOpacity={0.7}>
        <Text style={estilos.textoBoton}>comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    zIndex: 10,
    gap: 12,
  },
  instruccion: {
    fontStyle: 'italic',
    fontSize: 13,
    color: 'rgba(200,184,154,0.6)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  boton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(200,184,154,0.3)',
  },
  textoBoton: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#c8b89a',
    textTransform: 'uppercase',
  },
});