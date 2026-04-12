import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useLetrasFlotantes, LetraFlotante } from '../../hooks/useLetrasFlotantes';
import { CANTIDAD_LETRAS_POR_NIVEL } from '../../datos/configuracionNiveles';

interface PropiedadesLetrasTrampaFlotantes {
  nivelActual: number;
  letrasProhibidas: string[];
}

export function LetrasTrampaFlotantes({
  nivelActual,
  letrasProhibidas,
}: PropiedadesLetrasTrampaFlotantes) {

  const cantidadLetras = CANTIDAD_LETRAS_POR_NIVEL[nivelActual];
  const { letrasActivas, opacidadRef } = useLetrasFlotantes(letrasProhibidas, cantidadLetras);

  return (
    <>
      {letrasActivas.map((item: LetraFlotante) => (
        <Animated.Text
          key={item.id}
          style={[
            estilos.letra,
            {
              top:       item.top,
              left:      item.left,
              transform: [{ rotate: `${item.rotacion}deg` }],
              opacity:   opacidadRef,
            },
          ]}
        >
          {item.letra}
        </Animated.Text>
      ))}
    </>
  );
}

const estilos = StyleSheet.create({
  letra: {
    position: 'absolute',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#c8b89a',
  },
});