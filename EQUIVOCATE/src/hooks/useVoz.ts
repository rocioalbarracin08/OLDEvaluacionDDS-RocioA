import { useCallback, useEffect, useRef } from 'react';

const MILISEGUNDOS_SILENCIO = 1500;

export function useVoz({ letrasProhibidas, estaActivo, onEmpezarAHablar, onDejarDeHablar, onLetraProhibidaDetectada, letrasDistintasRequeridas = 2 }: any) {
  const timeoutSilencioRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const webViewRef = useRef<any>(null);
  const letrasRef = useRef(letrasProhibidas || []);
  const letrasDetectadasRef = useRef<Set<string>>(new Set());
  const estaHablandoRef = useRef(false);

  useEffect(() => { letrasRef.current = letrasProhibidas || []; }, [letrasProhibidas]);

  const limpiarBuffer = useCallback((callOnDejar = true) => {
    if (timeoutSilencioRef.current) { clearTimeout(timeoutSilencioRef.current); timeoutSilencioRef.current = null; }
    letrasDetectadasRef.current.clear();
    estaHablandoRef.current = false;
    if (callOnDejar) onDejarDeHablar();
  }, [onDejarDeHablar]);

  const reiniciarSilencio = useCallback(() => {
    if (timeoutSilencioRef.current) clearTimeout(timeoutSilencioRef.current);
    timeoutSilencioRef.current = setTimeout(() => { limpiarBuffer(true); }, MILISEGUNDOS_SILENCIO);
  }, [limpiarBuffer]);

  const manejarMensajeWebView = useCallback((evento: any) => {
    try {
      const raw = evento?.nativeEvent?.data;
      console.log('[useVoz] raw message from WebView:', raw);
      const datos = typeof raw === 'string' ? JSON.parse(raw) : raw;
      console.log('[useVoz] parsed:', datos);
      if (!datos || datos.tipo !== 'resultado') return;

      const texto = (datos.texto || '').toUpperCase();
      console.log('[useVoz] mensaje recibido:', texto);

      const tieneProhibida = letrasRef.current.some((lp: string) => texto.includes(lp.toUpperCase()));
      if (tieneProhibida) {
        limpiarBuffer(false);
        onLetraProhibidaDetectada();
        return;
      }

      const letras = texto.match(/[A-ZÁÉÍÓÚÜÑ]/g) || [];
      letras.forEach((ch: string) => letrasDetectadasRef.current.add(ch));

      reiniciarSilencio();

      if (!estaHablandoRef.current && letrasDetectadasRef.current.size >= letrasDistintasRequeridas) {
        estaHablandoRef.current = true;
        letrasDetectadasRef.current.clear();
        console.log('[useVoz] activar empezar a hablar');
        onEmpezarAHablar();
      }
    } catch (e) {
      console.error('useVoz: error parseando mensaje', e);
    }
  }, [onEmpezarAHablar, onLetraProhibidaDetectada, limpiarBuffer, reiniciarSilencio, letrasDistintasRequeridas]);

  useEffect(() => {
    if (!webViewRef.current) return;
    const payload = JSON.stringify({ accion: estaActivo ? 'iniciar' : 'detener' });
    // usar postMessage del WebView (más confiable que inyectar script)
    try {
      if (webViewRef.current.postMessage) {
        webViewRef.current.postMessage(payload);
        console.log('[useVoz] enviado payload a WebView via postMessage:', payload);
      } else {
        // fallback: inject JS that dispatches event inside the webview
        const script = `window.dispatchEvent(new MessageEvent('message', { data: '${payload}' })); true;`;
        webViewRef.current.injectJavaScript && webViewRef.current.injectJavaScript(script);
        console.log('[useVoz] enviado payload a WebView via injectJavaScript fallback');
      }
    } catch (e) {
      console.error('[useVoz] error enviando payload a WebView', e);
    }

    if (!estaActivo) limpiarBuffer(false);
  }, [estaActivo, limpiarBuffer]);

  return { webViewRef, manejarMensajeWebView };
}