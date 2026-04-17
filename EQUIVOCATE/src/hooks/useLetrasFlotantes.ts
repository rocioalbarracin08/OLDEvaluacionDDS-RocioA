import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  POSICIONES_ALREDEDOR_RECTANGULO,
  INTERVALO_CAMBIO_LETRAS_MS,
  elegirLetrasAleatorias,
  generarLetrasAleatorias,
} from '../datos/configuracionNiveles';

export type LetraFlotante = {
  id:       number;
  letra:    string;
  top:      number;
  left:     number;
  rotacion: number;
};

// Genera un set nuevo mezclando letras Y posiciones de forma independiente
function nuevoSet(letrasProhibidas: string[], cantidad: number, semilla = 0): LetraFlotante[] {
  if (letrasProhibidas.length) {
    // generarLetrasAleatorias ya mezcla ambas listas
    return generarLetrasAleatorias(letrasProhibidas, cantidad).map((l, i) => ({
      ...l,
      id: semilla * 100 + i,
    }));
  }
  // sin letras prohibidas: pool completamente aleatorio
  const letras     = elegirLetrasAleatorias(cantidad);
  const posiciones = [...POSICIONES_ALREDEDOR_RECTANGULO].sort(() => Math.random() - 0.5);
  return letras.map((letra, i) => ({
    id:       semilla * 100 + i,
    letra,
    top:      posiciones[i % posiciones.length].top,
    left:     posiciones[i % posiciones.length].left,
    rotacion: posiciones[i % posiciones.length].rotacion,
  }));
}

export function useLetrasFlotantes(letrasProhibidas: string[] = [], cantidad = 6) {
  const [letrasActivas, setLetrasActivas] = useState<LetraFlotante[]>(() =>
    nuevoSet(letrasProhibidas, cantidad, 0)
  );

  const opacidadRef  = useRef(new Animated.Value(1)).current;
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef      = useRef(1);
  // ref para no recrear el intervalo cuando cambian letrasProhibidas
  const letrasRef    = useRef(letrasProhibidas);
  useEffect(() => { letrasRef.current = letrasProhibidas; }, [letrasProhibidas]);

  useEffect(() => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);

    intervaloRef.current = setInterval(() => {
      const tick = tickRef.current++;

      // fade out → actualizar → fade in
      Animated.timing(opacidadRef, { toValue: 0, duration: 120, useNativeDriver: true })
        .start(() => {
          setLetrasActivas(nuevoSet(letrasRef.current, cantidad, tick));
          Animated.timing(opacidadRef, { toValue: 1, duration: 120, useNativeDriver: true }).start();
        });
    }, INTERVALO_CAMBIO_LETRAS_MS);

    return () => {
      if (intervaloRef.current) { clearInterval(intervaloRef.current); intervaloRef.current = null; }
    };
  }, [cantidad, opacidadRef]); // no depende de letrasProhibidas — usa la ref

  const forzarActualizar = () => {
    setLetrasActivas(nuevoSet(letrasRef.current, cantidad, Date.now()));
  };

  return { letrasActivas, opacidadRef, forzarActualizar };
}