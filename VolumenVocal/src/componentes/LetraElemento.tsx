import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LetraInteractiva } from '../tipos/Letra';

interface PropiedadesDeLaLetra {
  letraObjeto: LetraInteractiva;
}

export const LetraElemento = ({ letraObjeto }: PropiedadesDeLaLetra) => {
  if (!letraObjeto) return null;

  const seEncuentraCapturada = letraObjeto.yaFueGritadaConExito;

  return (
    <View style={[
      estilosDeLaLetra.contenedorDeLaLetra,
      {
        left: letraObjeto.posicionEnEjeHorizontal,
        top: letraObjeto.posicionEnEjeVertical,
      }
    ]}>
      {seEncuentraCapturada && (
        <View style={[
            estilosDeLaLetra.graficoDeLaFlor, 
            { opacity: letraObjeto.nivelDeOpacidadVisual } //Intensidad visual según volumen
        ]} />
      )}
      
      <Text style={[
        estilosDeLaLetra.caracterEscrito,
        {
          fontSize: seEncuentraCapturada ? 18 : 45, 
          color: seEncuentraCapturada ? '#FFFFFF' : '#1D3D47',
          opacity: seEncuentraCapturada ? 1 : 0.7 
        }
      ]}>
        {letraObjeto.caracterIndividual}
      </Text>
    </View>
  );
};

const estilosDeLaLetra = StyleSheet.create({
  contenedorDeLaLetra: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
  },
  graficoDeLaFlor: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19, 
    backgroundColor: '#7c5468', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  caracterEscrito: {
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 10, 
  }
});