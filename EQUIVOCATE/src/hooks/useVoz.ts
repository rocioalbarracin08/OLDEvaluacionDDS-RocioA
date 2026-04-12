import { useEffect, useRef, useCallback } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

const MILISEGUNDOS_SILENCIO = 1200;

interface ConfiguracionVoz {
  letrasProhibidas: string[];
  estaActivo: boolean;
  onEmpezarAHablar: () => void;
  onDejarDeHablar: () => void;
  onLetraProhibidaDetectada: () => void;
}

export function useVoz({
  letrasProhibidas,
  estaActivo,
  onEmpezarAHablar,
  onDejarDeHablar,
  onLetraProhibidaDetectada,
}: ConfiguracionVoz) {

  const timeoutSilencioRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const estaHablandoRef    = useRef(false);

  const contieneLetraProhibida = useCallback(
    (texto: string) =>
      letrasProhibidas.some((letra) => texto.toUpperCase().includes(letra)),
    [letrasProhibidas]
  );

  const registrarVoz = useCallback(() => {
    if (!estaHablandoRef.current) {
      estaHablandoRef.current = true;
      onEmpezarAHablar();
    }
    clearTimeout(timeoutSilencioRef.current!);
    timeoutSilencioRef.current = setTimeout(() => {
      estaHablandoRef.current = false;
      onDejarDeHablar();
    }, MILISEGUNDOS_SILENCIO);
  }, [onEmpezarAHablar, onDejarDeHablar]);

  useSpeechRecognitionEvent('result', (evento) => {
    if (!estaActivo) return;
    const texto = evento.results[0]?.transcript ?? '';
    if (contieneLetraProhibida(texto)) {
      clearTimeout(timeoutSilencioRef.current!);
      estaHablandoRef.current = false;
      onLetraProhibidaDetectada();
      return;
    }
    registrarVoz();
  });

  useEffect(() => {
    if (estaActivo) {
      ExpoSpeechRecognitionModule.start({
        lang: 'es-AR',
        interimResults: true,
        continuous: true,
      });
    } else {
      ExpoSpeechRecognitionModule.stop();
      clearTimeout(timeoutSilencioRef.current!);
      estaHablandoRef.current = false;
    }
    return () => {
      ExpoSpeechRecognitionModule.stop();
      clearTimeout(timeoutSilencioRef.current!);
    };
  }, [estaActivo]);
}