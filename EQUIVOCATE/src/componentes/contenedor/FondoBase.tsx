import React from 'react';
import { View, StyleSheet } from 'react-native'; // ← Quitá SafeAreaView

interface PropiedadesFondoBase {
  children: React.ReactNode;
}

export function FondoBase({ children }: PropiedadesFondoBase) {
  return (
    <View style={estilos.fondo}>  
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});