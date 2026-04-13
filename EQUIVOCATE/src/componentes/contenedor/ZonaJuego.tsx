import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PropiedadesZonaJuego {
  children: React.ReactNode;
}

export function ZonaJuego({ children }: PropiedadesZonaJuego) {
  return (
    <View style={estilos.zona}>
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  zona: {
    position: 'relative',
    width: 340,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
});