export const LETRAS_TRAMPA_INICIALES = ['F', 'X', 'Q'];

export const CANTIDAD_LETRAS_POR_NIVEL = [3, 4, 5];

export const PORCENTAJE_PARA_NIVEL_2 = 0.33;
export const PORCENTAJE_PARA_NIVEL_3 = 0.66;

export const CARACTERES_POR_REVELADO = 3;
export const VELOCIDAD_REVELADO_MS = 500;

export const SEGUNDOS_CUENTA_REGRESIVA = 5;
export const INTERVALO_CAMBIO_LETRAS_MS = 3000;

const TODAS_LAS_LETRAS = 'ABCDEGHIJKLMNOPRSTUVWYZ';

export const generarPosicionAleatoria = () => ({
  top:      Math.random() * 340,
  left:     Math.random() * 280,
  rotacion: Math.random() * 60 - 30,
});

export const generarLetrasAleatorias = (letrasProhibidas: string[], cantidad: number) =>
  Array.from({ length: cantidad }, (_, i) => ({
    id:       i,
    letra:    letrasProhibidas[i] ?? TODAS_LAS_LETRAS.split('').filter(
                (l) => !letrasProhibidas.includes(l)
              )[Math.floor(Math.random() * (TODAS_LAS_LETRAS.length - letrasProhibidas.length))],
    ...generarPosicionAleatoria(),
  }));