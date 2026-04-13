import { useState, useCallback, useEffect } from 'react';
import { usePoema }                from './usePoema';
import { useVoz }                  from './useVoz';
import {
  LETRAS_TRAMPA_INICIALES,
  INTERVALO_CAMBIO_LETRAS_MS,
  CANTIDAD_LETRAS_POR_NIVEL,
  elegirLetrasAleatorias,
} from '../datos/configuracionNiveles';

export function useJuego() {

  const [juegoIniciado, setJuegoIniciado]       = useState(false);
  const [estaEscuchando, setEstaEscuchando]     = useState(false);
  const [huboErrorTrampa, setHuboErrorTrampa]   = useState(false);
  const [letrasProhibidas, setLetrasProhibidas] = useState<string[]>(LETRAS_TRAMPA_INICIALES);

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
    reiniciar();
    setHuboErrorTrampa(true);
    setTimeout(() => setHuboErrorTrampa(false), 1500);
  }, [reiniciar]);

  const { webViewRef, manejarMensajeWebView } = useVoz({
    letrasProhibidas,
    estaActivo:                estaEscuchando,
    onEmpezarAHablar:          empezarARevelar,
    onDejarDeHablar:           iniciarCuentaRegresiva,
    onLetraProhibidaDetectada: manejarLetraProhibida,
  });

  useEffect(() => {
    const cantidad = CANTIDAD_LETRAS_POR_NIVEL[nivelActual];
    const intervalo = setInterval(() => {
      setLetrasProhibidas(elegirLetrasAleatorias(cantidad));
    }, INTERVALO_CAMBIO_LETRAS_MS);
    return () => clearInterval(intervalo);
  }, [nivelActual]);

  const comenzarJuego       = () => setJuegoIniciado(true);
  const activarMicrofono    = () => setEstaEscuchando(true);
  const desactivarMicrofono = () => { setEstaEscuchando(false); reiniciar(); };

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