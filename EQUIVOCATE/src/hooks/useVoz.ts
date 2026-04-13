import { useCallback, useEffect, useRef } from 'react';

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
  const webViewRef         = useRef<any>(null);
  const letrasDetectadasRef = useRef<Set<string>>(new Set());
  const LETRAS_DISTINTAS_REQUERIDAS = 2;

  const contieneLetraProhibida = useCallback(
    (texto: string) =>
      letrasProhibidas.some((letra) => texto.toUpperCase().includes(letra)),
    [letrasProhibidas]
  );

  const registrarVoz = useCallback(() => {
    clearTimeout(timeoutSilencioRef.current!);
    timeoutSilencioRef.current = setTimeout(() => {
      estaHablandoRef.current = false;
      letrasDetectadasRef.current.clear();
      onDejarDeHablar();
    }, MILISEGUNDOS_SILENCIO);
  }, [onDejarDeHablar]);

  const manejarMensajeWebView = useCallback((evento: any) => {
    const datos = JSON.parse(evento.nativeEvent.data);
    if (datos.tipo !== 'resultado') return;

    if (contieneLetraProhibida(datos.texto)) {
      clearTimeout(timeoutSilencioRef.current!);
      estaHablandoRef.current = false;
      letrasDetectadasRef.current.clear();
      onLetraProhibidaDetectada();
      return;
    }

    // Extraer letras individuales del texto reconocido
    const texto = (datos.texto || '').toUpperCase();
    const letrasEncontradas = texto.match(/[A-Z]/g) || [];
    letrasEncontradas.forEach((ch: string) => letrasDetectadasRef.current.add(ch));

    // Registrar voz (resetea el timeout de silencio)
    registrarVoz();

    // Si aún no estamos en modo "hablando" y se detectaron suficientes letras distintas,
    // consideramos que el usuario empezó a hablar de forma válida.
    if (!estaHablandoRef.current && letrasDetectadasRef.current.size >= LETRAS_DISTINTAS_REQUERIDAS) {
      estaHablandoRef.current = true;
      letrasDetectadasRef.current.clear();
      onEmpezarAHablar();
    }
  }, [contieneLetraProhibida, registrarVoz, onLetraProhibidaDetectada, onEmpezarAHablar]);

  useEffect(() => {
    if (!webViewRef.current) return;
    const accion = estaActivo ? 'iniciar' : 'detener';
    webViewRef.current.injectJavaScript(
      `window.dispatchEvent(new MessageEvent('message', { data: '${JSON.stringify({ accion })}' })); true;`
    );
    if (!estaActivo) {
      clearTimeout(timeoutSilencioRef.current!);
      estaHablandoRef.current = false;
      letrasDetectadasRef.current.clear();
    }
  }, [estaActivo]);

  return { webViewRef, manejarMensajeWebView };
}