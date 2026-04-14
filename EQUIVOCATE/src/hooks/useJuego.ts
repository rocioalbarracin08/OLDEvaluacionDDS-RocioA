import { useCallback, useState } from 'react';
import { obtenerLetrasTrampaIniciales } from '../datos/configuracionNiveles';
import { usePoema } from './usePoema';
import { useVoz } from './useVoz';

export function useJuego() {
  const [juegoIniciado, setJuegoIniciado]       = useState(false);
  const [estaEscuchando, setEstaEscuchando]     = useState(false);
  const [huboErrorTrampa, setHuboErrorTrampa]   = useState(false);
  const [letrasProhibidas, setLetrasProhibidas] = useState<string[]>(obtenerLetrasTrampaIniciales());

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

  const manejarLetraProhibida = useCallback(() => {
    setHuboErrorTrampa(true);
    reiniciar();
    setTimeout(() => setHuboErrorTrampa(false), 1200);
  }, [reiniciar]);

  const onEmpezarAHablar = useCallback(() => {
    // cada vez que el hook de voz confirma, pedimos al poema revelar
    empezarARevelar();
  }, [empezarARevelar]);

  const onDejarDeHablar = useCallback(() => {
    setEstaEscuchando(false);
  }, []);

  const { webViewRef, manejarMensajeWebView } = useVoz({
    letrasProhibidas,
    estaActivo: estaEscuchando,
    onEmpezarAHablar: onEmpezarAHablar,
    onDejarDeHablar: onDejarDeHablar,
    onLetraProhibidaDetectada: manejarLetraProhibida,
    letrasDistintasRequeridas: 1,
  });

  const comenzarJuego = useCallback(() => {
    reiniciar();
    setJuegoIniciado(true);
  }, [reiniciar]);

  const activarMicrofono = useCallback(() => {
    setEstaEscuchando(true);
  }, []);

  const desactivarMicrofono = useCallback(() => {
    setEstaEscuchando(false);
  }, []);

  return {
    juegoIniciado,
    estaEscuchando,
    huboErrorTrampa,
    fragmentoVisible,
    porcentajeRevelado,
    nivelActual,
    opacidadPoema,
    segundosRestantes,
    letrasProhibidas,
    webViewRef,
    manejarMensajeWebView,
    comenzarJuego,
    activarMicrofono,
    desactivarMicrofono,
  };
}