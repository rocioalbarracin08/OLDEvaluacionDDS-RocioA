import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Dimensions, Platform } from 'react-native';
import { LetraInteractiva, poemaCompletoParaObtener } from '../tipos/Letra';

const { width: ANCHO_TOTAL_DE_LA_PANTALLA_DEL_USUARIO } = Dimensions.get('window');
const ESPACIO_DE_SEGURIDAD_LATERAL = 40; 
const AREA_UTIL_PARA_LA_CAIDA_DE_CARACTERES = ANCHO_TOTAL_DE_LA_PANTALLA_DEL_USUARIO - (ESPACIO_DE_SEGURIDAD_LATERAL * 2);

export function useLluviaVocal() {
  const [listadoDeLetrasActivasEnSimulacion, setListadoDeLetrasActivasEnSimulacion] = useState<LetraInteractiva[]>([]);
  const [intensidadSonoraDetectadaPorMicrofono, setIntensidadSonoraDetectadaPorMicrofono] = useState(0);
  const [indiceDeSeguimientoDelPoemaOriginal, setIndiceDeSeguimientoDelPoemaOriginal] = useState(0);
  const referenciaDelObjetoDeGrabacionDeAudio = useRef<Audio.Recording | null>(null);

  const crearObjetoDeLetraConConfiguracionCompleta = useCallback((caracterTextoEspecifico: string, posicionEnLaSecuencia: number): LetraInteractiva => {
    const calculoDePosicionHorizontalAleatoria = Math.random() * AREA_UTIL_PARA_LA_CAIDA_DE_CARACTERES + ESPACIO_DE_SEGURIDAD_LATERAL;
    
    return {
      idDeLaLetra: `identificador-unico-letra-${posicionEnLaSecuencia}-${Math.random()}`,
      caracterIndividual: caracterTextoEspecifico,
      posicionEnEjeHorizontal: calculoDePosicionHorizontalAleatoria,
      posicionEnEjeVertical: 200, 
      nivelDeOpacidadVisual: 0.1, 
      yaFueGritadaConExito: false,
    };
  }, []);

  useEffect(() => {
    if (listadoDeLetrasActivasEnSimulacion.length === 0 && poemaCompletoParaObtener.length > 0) {
      const primeraLetraDeLaPartida = crearObjetoDeLetraConConfiguracionCompleta(poemaCompletoParaObtener[0], 0);
      setListadoDeLetrasActivasEnSimulacion([primeraLetraDeLaPartida]);
      setIndiceDeSeguimientoDelPoemaOriginal(1);
    }
  }, [crearObjetoDeLetraConConfiguracionCompleta]);

  useEffect(() => {
    async function configurarAccesoAlHardwareDeAudio() {
      try {
        const { status: estadoDelPermisoDeVoz } = await Audio.requestPermissionsAsync();
        if (estadoDelPermisoDeVoz !== 'granted') return;
        
        //Ajuste específico para Android: Evita conflictos con otras apps
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });

        const instanciaDeLaGrabacionActual = new Audio.Recording();
        await instanciaDeLaGrabacionActual.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        
        instanciaDeLaGrabacionActual.setOnRecordingStatusUpdate(estadoDeLaEntradaDeAudio => {
          if (estadoDeLaEntradaDeAudio.metering !== undefined) {
            const nivelDePotenciaNormalizado = Math.pow(10, estadoDeLaEntradaDeAudio.metering / 20) * 100;
            setIntensidadSonoraDetectadaPorMicrofono(nivelDePotenciaNormalizado);
          }
        });

        await instanciaDeLaGrabacionActual.startAsync();
        referenciaDelObjetoDeGrabacionDeAudio.current = instanciaDeLaGrabacionActual;
      } catch (errorDeInicializacionDeHardware) { 
        console.error("Error critico de audio:", errorDeInicializacionDeHardware); 
      }
    }
    configurarAccesoAlHardwareDeAudio();
    return () => {
        //"Limpieza obligatoria para que Android no bloquee el microfono al salir"
        referenciaDelObjetoDeGrabacionDeAudio.current?.stopAndUnloadAsync();
    };
  }, []);

  useEffect(() => {
    const intervaloDelCicloDeVidaDelJuego = setInterval(() => {
      setListadoDeLetrasActivasEnSimulacion(listadoDeMemoriaPrevio => {
        if (listadoDeMemoriaPrevio.length === 0) return listadoDeMemoriaPrevio;

        let seHaProducidoUnaFallaPorCaidaAlVacio = false;
        const subconjuntoDeLetrasYaConvertidasEnFlores = listadoDeMemoriaPrevio.filter(elemento => elemento.yaFueGritadaConExito);
        const subconjuntoDeLetrasEnProcesoDeCaida = listadoDeMemoriaPrevio.filter(elemento => !elemento.yaFueGritadaConExito);

        const cantidadDeLetrasLogradas = subconjuntoDeLetrasYaConvertidasEnFlores.length;
        const ajusteDeDesplazamientoHaciaArriba = Math.floor(cantidadDeLetrasLogradas / 8) * 45;

        const floresEnLaGrillaActualizadas = subconjuntoDeLetrasYaConvertidasEnFlores.map((letraObjeto, indiceInterno) => {
            const maximoDeCaracteresPorFila = 8;
            const filaActualDeLaFlor = Math.floor(indiceInterno / maximoDeCaracteresPorFila);
            const columnaActualDeLaFlor = indiceInterno % maximoDeCaracteresPorFila;
            const posicionXInicialDeLaGrillaCentrada = (ANCHO_TOTAL_DE_LA_PANTALLA_DEL_USUARIO - (maximoDeCaracteresPorFila * 35)) / 2;

            return {
              ...letraObjeto,
              posicionEnEjeHorizontal: posicionXInicialDeLaGrillaCentrada + (columnaActualDeLaFlor * 35),
              posicionEnEjeVertical: 70 + (filaActualDeLaFlor * 45) - ajusteDeDesplazamientoHaciaArriba,
            };
        });

        let seDetectoCapturaDeVozEnEsteCiclo = false;
        const caidaDeCaracteresActualizada = subconjuntoDeLetrasEnProcesoDeCaida.map(letraEnCaida => {
          const nuevaCoordenadaVertical = letraEnCaida.posicionEnEjeVertical + 10;
          if (nuevaCoordenadaVertical > 780) seHaProducidoUnaFallaPorCaidaAlVacio = true;

          if (intensidadSonoraDetectadaPorMicrofono > 15 && !seDetectoCapturaDeVozEnEsteCiclo) {
            seDetectoCapturaDeVozEnEsteCiclo = true;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            return { 
              ...letraEnCaida, 
              yaFueGritadaConExito: true, 
              nivelDeOpacidadVisual: Math.min(1, Math.max(0.3, intensidadSonoraDetectadaPorMicrofono / 45)) 
            };
          }
          return { ...letraEnCaida, posicionEnEjeVertical: nuevaCoordenadaVertical };
        });

        if (seHaProducidoUnaFallaPorCaidaAlVacio) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setIndiceDeSeguimientoDelPoemaOriginal(1);
          return [crearObjetoDeLetraConConfiguracionCompleta(poemaCompletoParaObtener[0], 0)];
        }

        const listadoFinalConsolidado = [...floresEnLaGrillaActualizadas, ...caidaDeCaracteresActualizada];

        const todasLasLetrasEnPantallaFueronGritadas = caidaDeCaracteresActualizada.every(letra => letra.yaFueGritadaConExito);
        const elPoemaTodaviaTieneLetrasPendientes = indiceDeSeguimientoDelPoemaOriginal < poemaCompletoParaObtener.length;

        if (todasLasLetrasEnPantallaFueronGritadas && seDetectoCapturaDeVozEnEsteCiclo && elPoemaTodaviaTieneLetrasPendientes) {
          const nuevaLetraParaLanzarAlEscenario = crearObjetoDeLetraConConfiguracionCompleta(poemaCompletoParaObtener[indiceDeSeguimientoDelPoemaOriginal], indiceDeSeguimientoDelPoemaOriginal);
          setIndiceDeSeguimientoDelPoemaOriginal(prev => prev + 1);
          return [...listadoFinalConsolidado, nuevaLetraParaLanzarAlEscenario];
        }

        return listadoFinalConsolidado;
      });
    }, 50);

    return () => clearInterval(intervaloDelCicloDeVidaDelJuego);
  }, [intensidadSonoraDetectadaPorMicrofono, crearObjetoDeLetraConConfiguracionCompleta, indiceDeSeguimientoDelPoemaOriginal]);

  return { listadoDeLetrasActivasEnSimulacion };
}