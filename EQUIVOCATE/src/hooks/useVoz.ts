import { useCallback, useEffect, useRef } from 'react';

// ─── tipos mínimos para Web Speech API (no están en el tipado de RN) ───────────
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const MILISEGUNDOS_SILENCIO = 1500;

export function useVoz({
  letrasProhibidas,
  estaActivo,
  onEmpezarAHablar,
  onDejarDeHablar,
  onLetraProhibidaDetectada,
  letrasDistintasRequeridas = 2,
}: any) {
  const reconocedorRef        = useRef<any>(null);
  const timeoutSilencioRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const letrasRef             = useRef<string[]>(letrasProhibidas || []);
  const letrasDetectadasRef   = useRef<Set<string>>(new Set());
  const estaHablandoRef       = useRef(false);
  const activoRef             = useRef(estaActivo);

  // mantener refs sincronizadas sin recrear callbacks
  useEffect(() => { letrasRef.current  = letrasProhibidas || []; }, [letrasProhibidas]);
  useEffect(() => { activoRef.current  = estaActivo;              }, [estaActivo]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const limpiarBuffer = useCallback((callOnDejar = true) => {
    if (timeoutSilencioRef.current) {
      clearTimeout(timeoutSilencioRef.current);
      timeoutSilencioRef.current = null;
    }
    letrasDetectadasRef.current.clear();
    estaHablandoRef.current = false;
    if (callOnDejar) onDejarDeHablar();
  }, [onDejarDeHablar]);

  const reiniciarSilencio = useCallback(() => {
    if (timeoutSilencioRef.current) clearTimeout(timeoutSilencioRef.current);
    timeoutSilencioRef.current = setTimeout(() => limpiarBuffer(true), MILISEGUNDOS_SILENCIO);
  }, [limpiarBuffer]);

  // ── procesar transcripción (misma logica que antes, pero sin JSON/WebView) ──
  const procesarTexto = useCallback((texto: string) => {
    const upper = texto.toUpperCase();
    console.log('[useVoz] texto reconocido:', upper);

    const tieneProhibida = letrasRef.current.some((lp: string) =>
      upper.includes(lp.toUpperCase())
    );
    if (tieneProhibida) {
      limpiarBuffer(false);
      onLetraProhibidaDetectada();
      return;
    }

    const letras = upper.match(/[A-ZÁÉÍÓÚÜÑ]/g) || [];
    letras.forEach((ch: string) => letrasDetectadasRef.current.add(ch));

    reiniciarSilencio();

    if (
      !estaHablandoRef.current &&
      letrasDetectadasRef.current.size >= letrasDistintasRequeridas
    ) {
      estaHablandoRef.current = true;
      letrasDetectadasRef.current.clear();
      console.log('[useVoz] activar empezar a hablar');
      onEmpezarAHablar();
    }
  }, [
    onEmpezarAHablar,
    onLetraProhibidaDetectada,
    limpiarBuffer,
    reiniciarSilencio,
    letrasDistintasRequeridas,
  ]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      console.error('[useVoz] Web Speech API no está disponible en este entorno.');
      return;
    }

    const rec = new SR();
    rec.lang            = 'es-ES';
    rec.continuous      = true;
    rec.interimResults  = true; // reaccionar rápido igual que el HTML anterior

    rec.onresult = (event: any) => {
      const ultimo = event.results[event.results.length - 1];
      const transcripcion = ultimo?.[0]?.transcript ?? '';
      procesarTexto(transcripcion);
    };

    rec.onend = () => {
      // si sigue activo, reiniciar automáticamente (igual que el HTML anterior)
      if (activoRef.current) {
        try { rec.start(); } catch (e) { console.log('[useVoz] reintentando...', e); }
      }
    };

    rec.onerror = (event: any) => {
      console.error('[useVoz] error:', event.error);
    };

    reconocedorRef.current = rec;

    return () => {
      try { rec.stop(); } catch (_) {}
    };
  }, []);  // solo se crea una vez; procesarTexto se actualiza via closure

  useEffect(() => {
    const rec = reconocedorRef.current;
    if (!rec) return;

    if (estaActivo) {
      try { rec.start(); } catch (e) { console.log('[useVoz] ya iniciado', e); }
    } else {
      try { rec.stop(); } catch (e) { console.log('[useVoz] ya detenido', e); }
      limpiarBuffer(false);
    }
  }, [estaActivo, limpiarBuffer]);

  // ya no exportamos webViewRef ni manejarMensajeWebView
  // devolvemos objetos vacíos/nulos para no romper el contrato de useJuego
  return {
    webViewRef:            null,   // <-- compatibilidad: useJuego lo pasa a la página
    manejarMensajeWebView: null,   // <-- ya no se usa
  };
}