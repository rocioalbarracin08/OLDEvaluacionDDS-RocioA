import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PropiedadesBotonMicrofono {
  estaEscuchando: boolean;
  huboErrorTrampa: boolean;
  nivelActual: number;
  porcentajeRevelado: number;
  onActivar: () => void;
  onDesactivar: () => void;
}

export function BotonMicrofono({
  estaEscuchando,
  huboErrorTrampa,
  nivelActual,
  porcentajeRevelado,
  onActivar,
  onDesactivar,
}: PropiedadesBotonMicrofono) {

  const alternarMicrofono = () => {
    if (estaEscuchando) {
      onDesactivar();
    } else {
      onActivar();
    }
  };

  const colorBorde = huboErrorTrampa ? '#a33' : estaEscuchando ? '#c8b89a' : 'rgba(200,184,154,0.4)';
  const colorFondo = huboErrorTrampa ? 'rgba(170,51,51,0.2)' : estaEscuchando ? 'rgba(200,184,154,0.13)' : 'transparent';

  return (
    <View style={estilos.contenedor}>

      <View style={estilos.barraContenedor}>
        <View style={[estilos.barraRelleno, { width: `${porcentajeRevelado * 100}%` }]} />
      </View>

      <Text style={estilos.nivelTexto}>nivel {nivelActual + 1}</Text>

      <TouchableOpacity
        style={[estilos.boton, { borderColor: colorBorde, backgroundColor: colorFondo }]}
        onPress={alternarMicrofono}
        activeOpacity={0.7}
      >
        <Text style={estilos.iconoMicrofono}>{estaEscuchando ? '●' : '◎'}</Text>
      </TouchableOpacity>

      <Text style={estilos.estadoTexto}>
        {estaEscuchando ? 'escuchando' : 'micrófono inactivo'}
      </Text>

    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    marginTop: 28,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 340,
  },
  barraContenedor: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(200,184,154,0.07)',
  },
  barraRelleno: {
    height: 2,
    backgroundColor: 'rgba(200,184,154,0.35)',
  },
  nivelTexto: {
    fontSize: 10,
    letterSpacing: 3,
    color: 'rgba(200,184,154,0.27)',
    textTransform: 'uppercase',
  },
  boton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconoMicrofono: {
    fontSize: 22,
    color: '#c8b89a',
  },
  estadoTexto: {
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(200,184,154,0.55)',
    textTransform: 'uppercase',
  },
});