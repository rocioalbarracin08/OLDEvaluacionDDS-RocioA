import { useState, useEffect } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { POEMA, Carta } from '../tipos/PartesDelPoema';

export function useControladorJuego() {
  const [estaListo, setEstaListo] = useState(false);
  const [cartas, setCartas] = useState<Carta[]>(POEMA);
  const [distanciaRecorrida, setDistanciaRecorrida] = useState(0);
  const [anguloActual, setAnguloActual] = useState(0);

  //Lógica de Voz para iniciar
  const manejarVozListo = () => {
    setEstaListo(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Speech.speak("Sistema iniciado. Buscá las cinco cartas en tu espacio.");
    
    //Agregar lógica para repartir las cartas 
    //en ángulos aleatorios para más complejidad técnica
  };

  //Sensor de Movimiento (Acelerómetro para pasos)
  useEffect(() => {
    let suscripcion: any;
    if (estaListo) {
      suscripcion = Accelerometer.addListener(datos => {
        const aceleracion = Math.sqrt(datos.x ** 2 + datos.y ** 2 + datos.z ** 2);
        if (aceleracion > 1.2) { //Sensibilidad del paso
          setDistanciaRecorrida(prev => prev + 0.1); //Simulamos avance
        }
      });
      Accelerometer.setUpdateInterval(100);
    }
    return () => suscripcion && suscripcion.remove();
  }, [estaListo]);

  //Sensor de Orientación (Giroscopio)
  useEffect(() => {
    let suscripcion: any;
    if (estaListo) {
      suscripcion = Gyroscope.addListener(datos => {
        setAnguloActual(prev => (prev + datos.z) % 360);
      });
      Gyroscope.setUpdateInterval(100);
    }
    return () => suscripcion && suscripcion.remove();
  }, [estaListo]);

  return {
    estaListo,
    distanciaRecorrida,
    anguloActual,
    cartas,
    manejarVozListo
  };
}