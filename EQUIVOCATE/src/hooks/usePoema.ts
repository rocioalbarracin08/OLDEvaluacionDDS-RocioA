import { useState, useRef, useCallback } from 'react';
import { POEMA_TEXTO } from '../datos/poema';
import {
  CARACTERES_POR_REVELADO,
  VELOCIDAD_REVELADO_MS,
  SEGUNDOS_CUENTA_REGRESIVA,
  PORCENTAJE_PARA_NIVEL_2,
  PORCENTAJE_PARA_NIVEL_3,
} from '../datos/configuracionNiveles';

export function usePoema() {
  const [caracteresRevelados, setCaracteresRevelados] = useState(0);
  const [nivelActual, setNivelActual]                 = useState(0);
  const [opacidadPoema, setOpacidadPoema]             = useState(0);
  const [segundosRestantes, setSegundosRestantes]     = useState<number | null>(null);

  const intervaloReveladoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intervaloCuentaRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const segundosRef          = useRef(SEGUNDOS_CUENTA_REGRESIVA);

  const detenerRevelado = useCallback(() => {
    clearInterval(intervaloReveladoRef.current!);
    intervaloReveladoRef.current = null;
  }, []);

  const detenerCuenta = useCallback(() => {
    clearInterval(intervaloCuentaRef.current!);
    intervaloCuentaRef.current = null;
  }, []);

  const calcularNivel = (progreso: number) => {
    if (progreso >= PORCENTAJE_PARA_NIVEL_3) return 2;
    if (progreso >= PORCENTAJE_PARA_NIVEL_2) return 1;
    return 0;
  };

  const reiniciar = useCallback(() => {
    detenerRevelado();
    detenerCuenta();
    segundosRef.current = SEGUNDOS_CUENTA_REGRESIVA;
    setCaracteresRevelados(0);
    setNivelActual(0);
    setOpacidadPoema(0);
    setSegundosRestantes(null);
  }, [detenerRevelado, detenerCuenta]);

  const empezarARevelar = useCallback(() => {
    detenerCuenta();
    setSegundosRestantes(null);
    segundosRef.current = SEGUNDOS_CUENTA_REGRESIVA;
    setOpacidadPoema(1);

    if (intervaloReveladoRef.current) return;
    intervaloReveladoRef.current = setInterval(() => {
      setCaracteresRevelados((prev) => {
        const siguiente = Math.min(prev + CARACTERES_POR_REVELADO, POEMA_TEXTO.length);
        setNivelActual(calcularNivel(siguiente / POEMA_TEXTO.length));
        if (siguiente >= POEMA_TEXTO.length) detenerRevelado();
        return siguiente;
      });
    }, VELOCIDAD_REVELADO_MS);
  }, [detenerCuenta, detenerRevelado]);

  const iniciarCuentaRegresiva = useCallback(() => {
    detenerRevelado();
    if (intervaloCuentaRef.current) return;

    segundosRef.current = SEGUNDOS_CUENTA_REGRESIVA;
    setSegundosRestantes(SEGUNDOS_CUENTA_REGRESIVA);

    intervaloCuentaRef.current = setInterval(() => {
      segundosRef.current -= 1;
      setOpacidadPoema(segundosRef.current / SEGUNDOS_CUENTA_REGRESIVA);
      setSegundosRestantes(segundosRef.current);
      if (segundosRef.current <= 0) reiniciar();
    }, 1000);
  }, [detenerRevelado, reiniciar]);

  return {
    fragmentoVisible:   POEMA_TEXTO.substring(0, caracteresRevelados),
    porcentajeRevelado: caracteresRevelados / POEMA_TEXTO.length,
    nivelActual,
    opacidadPoema,
    segundosRestantes,
    empezarARevelar,
    iniciarCuentaRegresiva,
    reiniciar,
  };
}