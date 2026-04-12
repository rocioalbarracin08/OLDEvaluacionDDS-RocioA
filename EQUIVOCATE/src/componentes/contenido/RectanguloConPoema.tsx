import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PropiedadesRectanguloConPoema {
  fragmentoVisible: string;
  opacidadPoema: number;
  segundosRestantes: number | null;
}

export function RectanguloConPoema({
  fragmentoVisible,
  opacidadPoema,
  segundosRestantes,
}: PropiedadesRectanguloConPoema) {

  const hayTexto        = fragmentoVisible.length > 0;
  const hayCuentaActiva = segundosRestantes !== null && segundosRestantes > 0;

  return (
    <View style={estilos.rectangulo}>

      <Text style={[estilos.textoPoema, { opacity: hayTexto ? opacidadPoema : 0 }]}>
        {fragmentoVisible}
      </Text>

      {hayCuentaActiva && (
        <View style={estilos.contenedorNumero} pointerEvents="none">
          <Text style={[estilos.numeroCuenta, { opacity: 1 - opacidadPoema }]}>
            {segundosRestantes}
          </Text>
        </View>
      )}

    </View>
  );
}

const estilos = StyleSheet.create({
  rectangulo: {
    width: 260,
    height: 320,
    borderWidth: 1,
    borderColor: 'rgba(200,184,154,0.27)',
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textoPoema: {
    fontStyle: 'italic',
    fontSize: 13,
    lineHeight: 22,
    color: '#e8dcc8',
    textAlign: 'center',
  },
  contenedorNumero: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroCuenta: {
    fontSize: 72,
    color: '#c8b89a',
    fontWeight: '100',
  },
});