import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useLluviaVocal } from '../../src/hooks/useLluviaVocal';
import { LetraElemento } from '../../src/componentes/LetraElemento';

export default function PantallaJuego() {
  const { listadoDeLetrasActivasEnSimulacion } = useLluviaVocal();

  return (
    <View style={estilosDeLaPantallaPrincipal.areaContenedora}>
      <StatusBar hidden />
      {listadoDeLetrasActivasEnSimulacion && listadoDeLetrasActivasEnSimulacion.map((letraEspecificaParaDibujar) => (
        <LetraElemento 
          key={letraEspecificaParaDibujar.idDeLaLetra} 
          letraObjeto={letraEspecificaParaDibujar} 
        />
      ))}
    </View>
  );
}

const estilosDeLaPantallaPrincipal = StyleSheet.create({
  areaContenedora: { 
    flex: 1, 
    backgroundColor: '#FDFDFD' 
  }
});