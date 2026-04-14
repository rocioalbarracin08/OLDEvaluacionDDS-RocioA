import React from 'react';
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useJuego } from '../../src/hooks/useJuego';

import { FondoBase }              from '../../src/componentes/contenedor/FondoBase';
import { PantallaInstrucciones }  from '../../src/componentes/contenedor/PantallaInstrucciones';
import { TituloEquivocate }       from '../../src/componentes/contenido/TituloEquivocate';
import { ZonaJuego }              from '../../src/componentes/contenedor/ZonaJuego';
import { LetrasTrampaFlotantes }  from '../../src/componentes/contenido/LetrasTrampaFlotantes';
import RectanguloConPoema          from '../../src/componentes/contenido/RectanguloConPoema';
import { BotonMicrofono }         from '../../src/componentes/controlador/BotonMicrofono';

export default function PaginaEquivocate() {
  const {
    juegoIniciado,
    estaEscuchando,
    huboErrorTrampa,
    fragmentoVisible,
    porcentajeRevelado,
    nivelActual,
    opacidadPoema,
    segundosRestantes,
    letrasProhibidas,
    webViewRef,
    manejarMensajeWebView,
    comenzarJuego,
    activarMicrofono,
    desactivarMicrofono,
  } = useJuego();

  const webviewSource = Platform.OS === 'android'
    ? { uri: 'file:///android_asset/reconocedorVoz.html' } 
    : require('../../assets/reconocedorVoz.html');

  return (
    <FondoBase>

      {!juegoIniciado && (
        <PantallaInstrucciones onComenzar={comenzarJuego} />
      )}

      <TituloEquivocate />

      <ZonaJuego>
        <LetrasTrampaFlotantes
          nivelActual={nivelActual}
          letrasProhibidas={letrasProhibidas}
        />
        <RectanguloConPoema
          fragmentoVisible={fragmentoVisible}
          opacidadPoema={opacidadPoema}
          segundosRestantes={segundosRestantes || 0}
        />
      </ZonaJuego>

      <BotonMicrofono
        estaEscuchando={estaEscuchando}
        huboErrorTrampa={huboErrorTrampa}
        nivelActual={nivelActual}
        porcentajeRevelado={porcentajeRevelado}
        onActivar={activarMicrofono}
        onDesactivar={desactivarMicrofono}
      />

      <WebView
        // asigno ref via callback para asegurar que webViewRef.current se setea correctamente
        ref={(r) => { if (webViewRef) (webViewRef as any).current = r; }}
        originWhitelist={['*']}
        source={webviewSource}
        onMessage={manejarMensajeWebView}
        style={{ width: 1, height: 1, opacity: 0, position: 'absolute' }}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />

    </FondoBase>
  );
}