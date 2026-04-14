import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import {
  POSICIONES_ALREDEDOR_RECTANGULO,
  INTERVALO_CAMBIO_LETRAS_MS,
  elegirLetrasAleatorias,
  generarLetrasAleatorias,
} from '../datos/configuracionNiveles';

export type LetraFlotante = {
  id: number;
  letra: string;
  top: number;
  left: number;
  rotacion: number;
};

export function useLetrasFlotantes(letrasProhibidas: string[] = [], cantidad = 6) {
  const [letrasActivas, setLetrasActivas] = useState<LetraFlotante[]>(() => {
    // inicio aleatorio
    const inicial = letrasProhibidas && letrasProhibidas.length
      ? generarLetrasAleatorias(letrasProhibidas, cantidad)
      : elegirLetrasAleatorias(cantidad).map((letra, i) => {
          const pos = POSICIONES_ALREDEDOR_RECTANGULO[i % POSICIONES_ALREDEDOR_RECTANGULO.length];
          return { id: i, letra, top: pos.top, left: pos.left, rotacion: pos.rotacion };
        });
    return inicial;
  });

  const opacidadRef = useRef(new Animated.Value(1)).current;
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickIdRef = useRef(0);

  useEffect(() => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    intervaloRef.current = setInterval(() => {
      // cada tick generamos un set NUEVO y aleatorio (no dependemos de un pool estático)
      const nuevas = (letrasProhibidas && letrasProhibidas.length)
        ? generarLetrasAleatorias(letrasProhibidas, cantidad)
        : elegirLetrasAleatorias(cantidad).map((letra, i) => {
            const pos = POSICIONES_ALREDEDOR_RECTANGULO[i % POSICIONES_ALREDEDOR_RECTANGULO.length];
            return { id: tickIdRef.current * 100 + i, letra, top: pos.top, left: pos.left, rotacion: pos.rotacion };
          });

      tickIdRef.current += 1;

      Animated.sequence([
        Animated.timing(opacidadRef, { toValue: 0, duration: 120, useNativeDriver: true }),
        Animated.timing(opacidadRef, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]).start();

      setLetrasActivas(nuevas);
    }, INTERVALO_CAMBIO_LETRAS_MS);

    return () => {
      if (intervaloRef.current) { clearInterval(intervaloRef.current); intervaloRef.current = null; }
    };
  }, [letrasProhibidas, cantidad, opacidadRef]);

  return { letrasActivas, opacidadRef, forzarActualizar: () => {
    const pool = (letrasProhibidas && letrasProhibidas.length) ? generarLetrasAleatorias(letrasProhibidas, cantidad) :
      elegirLetrasAleatorias(cantidad).map((letra, i) => {
        const pos = POSICIONES_ALREDEDOR_RECTANGULO[i % POSICIONES_ALREDEDOR_RECTANGULO.length];
        return { id: Date.now() + i, letra, top: pos.top, left: pos.left, rotacion: pos.rotacion };
      });
    setLetrasActivas(pool);
  }};
}