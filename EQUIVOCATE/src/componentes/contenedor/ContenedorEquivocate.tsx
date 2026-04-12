import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import { PantallaInstrucciones }   from './PantallaInstrucciones';
import { BotonMicrofono }          from '../controlador/BotonMicrofono';
import { RectanguloConPoema }      from '../contenido/RectanguloConPoema';
import { LetrasTrampaFlotantes }   from '../contenido/LetrasTrampaFlotantes';
import { usePoema }                from '../../hooks/usePoema';
import { useVoz }                  from '../../hooks/useVoz';
import { LETRAS_TRAMPA_INICIALES } from '../../datos/configuracionNiveles';

export function ContenedorEquivocate() {

  const [juegoIniciado, setJuegoIniciado]     = useState(false);
  const [estaEscuchando, setEstaEscuchando]   = useState(false);
  const [huboErrorTrampa, setHuboErrorTrampa] = useState(false);

  const {
    fragmentoVisible,
    porcentajeRevelado,
    nivelActual,
    opacidadPoema,
    segundosRestantes,
    empezarARevelar,
    iniciarCuentaRegresiva,
    reiniciar,
  } = usePoema();

  const letrasProhibidas = LETRAS_TRAMPA_INICIALES;

  const manejarLetraProhibida = useCallback(() => {
    reiniciar();
    setHuboErrorTrampa(true);
    setTimeout(() => setHuboErrorTrampa(false), 1500);
  }, [reiniciar]);

  useVoz({
    letrasProhibidas,
    estaActivo:                estaEscuchando,
    onEmpezarAHablar:          empezarARevelar,
    onDejarDeHablar:           iniciarCuentaRegresiva,
    onLetraProhibidaDetectada: manejarLetraProhibida,
  });

  const manejarActivar    = () => setEstaEscuchando(true);
  const manejarDesactivar = () => { setEstaEscuchando(false); reiniciar(); };

  return (
    <SafeAreaView style={estilos.fondo}>

      {!juegoIniciado && (
        <PantallaInstrucciones onComenzar={() => setJuegoIniciado(true)} />
      )}

      <Text style={estilos.titulo}>Equivocate</Text>

      <View style={estilos.zonaJuego}>
        <LetrasTrampaFlotantes
          nivelActual={nivelActual}
          letrasProhibidas={letrasProhibidas}
        />
        <RectanguloConPoema
          fragmentoVisible={fragmentoVisible}
          opacidadPoema={opacidadPoema}
          segundosRestantes={segundosRestantes}
        />
      </View>

      <BotonMicrofono
        estaEscuchando={estaEscuchando}
        huboErrorTrampa={huboErrorTrampa}
        nivelActual={nivelActual}
        porcentajeRevelado={porcentajeRevelado}
        onActivar={manejarActivar}
        onDesactivar={manejarDesactivar}
      />

    </SafeAreaView>
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
  titulo: {
    fontSize: 34,
    letterSpacing: 10,
    color: '#c8b89a',
    textTransform: 'uppercase',
    marginBottom: 32,
    opacity: 0.85,
    fontWeight: '400',
  },
  zonaJuego: {
    position: 'relative',
    width: 340,
    height: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
});