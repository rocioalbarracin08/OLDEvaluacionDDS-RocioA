import React from 'react';
import { useJuego } from '../../src/hooks/useJuego';

import { FondoBase }             from '../../src/componentes/contenedor/FondoBase';
import { PantallaInstrucciones } from '../../src/componentes/contenedor/PantallaInstrucciones';
import { TituloEquivocate }      from '../../src/componentes/contenido/TituloEquivocate';
import { ZonaJuego }             from '../../src/componentes/contenedor/ZonaJuego';
import { LetrasTrampaFlotantes } from '../../src/componentes/contenido/LetrasTrampaFlotantes';
import RectanguloConPoema        from '../../src/componentes/contenido/RectanguloConPoema';
import { BotonMicrofono }        from '../../src/componentes/controlador/BotonMicrofono';

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

    </FondoBase>
  );
}