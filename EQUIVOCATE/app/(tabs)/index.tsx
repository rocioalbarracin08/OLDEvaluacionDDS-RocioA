import React from 'react';
import { WebView } from 'react-native-webview';

import { FondoBase }              from '../../src/componentes/contenedor/FondoBase';
import { PantallaInstrucciones }  from '../../src/componentes/contenedor/PantallaInstrucciones';
import { TituloEquivocate }       from '../../src/componentes/contenido/TituloEquivocate';
import { ZonaJuego }              from '../../src/componentes/contenedor/ZonaJuego';
import { LetrasTrampaFlotantes }  from '../../src/componentes/contenido/LetrasTrampaFlotantes';
import { RectanguloConPoema }     from '../../src/componentes/contenido/RectanguloConPoema';
import { BotonMicrofono }         from '../../src/componentes/controlador/BotonMicrofono';
import { useJuego }               from '../../src/hooks/useJuego';

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
          segundosRestantes={segundosRestantes}
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
        ref={webViewRef}
        source={require('../../assets/reconocedorVoz.html')}
        onMessage={manejarMensajeWebView}
        style={{ width: 0, height: 0 }}
      />

    </FondoBase>
  );
}