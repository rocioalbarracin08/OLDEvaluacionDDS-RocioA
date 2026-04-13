import { useCallback, useEffect, useRef } from 'react';

const MILISEGUNDOS_SILENCIO = 1500; // Aumentado un poco para dar margen al hablar

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
  const webViewRef = useRef<any>(null);

  // Mantenemos una referencia actualizada de las letras prohibidas
  // para que el callback de la WebView siempre las vea sin reiniciarse
  const letrasRef = useRef(letrasProhibidas);
  useEffect(() => {
    letrasRef.current = letrasProhibidas;
  }, [letrasProhibidas]);

  const manejarMensajeWebView = useCallback((evento: any) => {
    try {
      const datos = JSON.parse(evento.nativeEvent.data);

      // LOG DE ENTRADA
      console.log("RN <- Recibido de WebView:", datos);

      if (datos.tipo === 'resultado') {
        const textoDetectado = datos.texto.toUpperCase();
        console.log('🗣️ Escuchado:', textoDetectado);

        // 1. Iniciar revelado del poema
        onEmpezarAHablar();

        // 2. Comprobar si dijo una letra prohibida
        const tieneLetraTrampa = letrasRef.current.some((letra) =>
          textoDetectado.includes(letra.toUpperCase())
        );

        if (tieneLetraTrampa) {
          console.log('¡PERDISTE! Letra prohibida detectada.');
          onLetraProhibidaDetectada();
        }

        // 3. Reiniciar el temporizador de silencio
        if (timeoutSilencioRef.current) clearTimeout(timeoutSilencioRef.current);
        
        timeoutSilencioRef.current = setTimeout(() => {
          console.log('Silencio detectado');
          onDejarDeHablar();
        }, MILISEGUNDOS_SILENCIO);
      }
    } catch (e) {
      console.error('Error en el mensaje de voz:', e);
    }
  }, [onEmpezarAHablar, onDejarDeHablar, onLetraProhibidaDetectada]);

  useEffect(() => {
    if (!webViewRef.current) return;

    const accion = estaActivo ? 'iniciar' : 'detener';

    // LOG DE INYECCIÓN
    console.log(`RN -> Inyectando acción: ${accion}`);
    
    // Inyectamos el comando a la WebView
    const script = `
      window.postMessage(JSON.stringify({ accion: '${accion}' }), '*');
      true;
    `;
    webViewRef.current.injectJavaScript(script);

    // Si se apaga el micro manualmente, limpiamos el timer
    if (!estaActivo && timeoutSilencioRef.current) {
      clearTimeout(timeoutSilencioRef.current);
    }
  }, [estaActivo]);

  return { webViewRef, manejarMensajeWebView };
}