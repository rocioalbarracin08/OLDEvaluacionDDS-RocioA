export const LETRAS_TRAMPA_INICIALES = ['F', 'X', 'Q'];

export const CANTIDAD_LETRAS_POR_NIVEL = [3, 4, 5];

export const PORCENTAJE_PARA_NIVEL_2 = 0.33;
export const PORCENTAJE_PARA_NIVEL_3 = 0.66;

export const CARACTERES_POR_REVELADO = 3;
export const VELOCIDAD_REVELADO_MS = 500;

export const SEGUNDOS_CUENTA_REGRESIVA = 5;
export const INTERVALO_CAMBIO_LETRAS_MS = 500;

export const POSICIONES_ALREDEDOR_RECTANGULO = [
  { top: 20,  left: 20,  rotacion: -25 },
  { top: 20,  left: 290, rotacion: 15  },
  { top: 180, left: 5,   rotacion: 20  },
  { top: 180, left: 310, rotacion: -10 },
  { top: 360, left: 150, rotacion: -18 },
];

const TODAS_LAS_LETRAS = 'ABCDEGHIJKLMNOPRSTUVWYZ'.split('');

export const elegirLetrasAleatorias = (cantidad: number): string[] => {
  const mezcladas = [...TODAS_LAS_LETRAS].sort(() => Math.random() - 0.5);
  return mezcladas.slice(0, cantidad);
};

export const generarLetrasAleatorias = (letrasProhibidas: string[], cantidad: number) => {
  const posicionesmezcladas = [...POSICIONES_ALREDEDOR_RECTANGULO]
    .sort(() => Math.random() - 0.5)
    .slice(0, cantidad);

  return letrasProhibidas.slice(0, cantidad).map((letra, i) => ({
    id:       i,
    letra,
    top:      posicionesmezcladas[i].top,
    left:     posicionesmezcladas[i].left,
    rotacion: posicionesmezcladas[i].rotacion,
  }));
};