export const CANTIDAD_LETRAS_POR_NIVEL = [3, 4];

export const PORCENTAJE_PARA_NIVEL_2 = 0.33;
export const PORCENTAJE_PARA_NIVEL_3 = 0.66;

export const CARACTERES_POR_REVELADO = 3;
export const VELOCIDAD_REVELADO_MS = 2000;

export const SEGUNDOS_CUENTA_REGRESIVA = 5;
export const INTERVALO_CAMBIO_LETRAS_MS = 1500;

export const POSICIONES_ALREDEDOR_RECTANGULO = [
  { top: 20,  left: 20,  rotacion: -25 },
  { top: 20,  left: 290, rotacion: 15  },
  { top: 180, left: 5,   rotacion: 20  },
  { top: 180, left: 310, rotacion: -10 },
  { top: 360, left: 150, rotacion: -18 },
];

const TODAS_LAS_LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const elegirLetrasAleatorias = (cantidad: number): string[] => {
  return [...TODAS_LAS_LETRAS].sort(() => Math.random() - 0.5).slice(0, cantidad);
};

export const obtenerLetrasTrampaIniciales = (cantidad = 3): string[] => {
  return elegirLetrasAleatorias(cantidad);
};

export const generarLetrasAleatorias = (letrasProhibidas: string[] = [], cantidad: number) => {
  // antes: pool estático → letras nunca cambiaban, solo la posición
  const letrasMezcladas = [...letrasProhibidas].sort(() => Math.random() - 0.5).slice(0, cantidad);
  const posicionesMezcladas = [...POSICIONES_ALREDEDOR_RECTANGULO].sort(() => Math.random() - 0.5).slice(0, cantidad);

  return letrasMezcladas.map((letra, i) => ({
    id:       i,
    letra,
    top:      posicionesMezcladas[i].top,
    left:     posicionesMezcladas[i].left,
    rotacion: posicionesMezcladas[i].rotacion,
  }));
};