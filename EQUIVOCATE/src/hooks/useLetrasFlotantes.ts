import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { generarLetrasAleatorias, INTERVALO_CAMBIO_LETRAS_MS } from '../datos/configuracionNiveles';

export interface LetraFlotante {
  id: number;
  letra: string;
  top: number;
  left: number;
  rotacion: number;
}

export function useLetrasFlotantes(letrasProhibidas: string[], cantidadLetras: number) {

  const [letrasActivas, setLetrasActivas] = useState<LetraFlotante[]>(() =>
    generarLetrasAleatorias(letrasProhibidas, cantidadLetras)
  );
  const opacidadRef = useRef(new Animated.Value(1)).current;

  const cambiarLetrasConTransicion = () => {
    Animated.timing(opacidadRef, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setLetrasActivas(generarLetrasAleatorias(letrasProhibidas, cantidadLetras));
      Animated.timing(opacidadRef, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    const intervalo = setInterval(cambiarLetrasConTransicion, INTERVALO_CAMBIO_LETRAS_MS);
    return () => clearInterval(intervalo);
  }, [letrasProhibidas, cantidadLetras]);

  return { letrasActivas, opacidadRef };
}