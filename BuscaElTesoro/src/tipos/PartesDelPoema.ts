export interface Carta {
  id: number;
  verso: string;
  consejo: string;
  estadoDeLaCarta: boolean;
}

export const POEMA: Carta[] = [
  { id: 1, verso: "..1", consejo: "Caminá hacia delante", estadoDeLaCarta: false },
  { id: 2, verso: "..2", consejo: "Caminá hacia delante", estadoDeLaCarta: false },
  { id: 3, verso: "..3", consejo: "Caminá hacia delante", estadoDeLaCarta: false },
  { id: 4, verso: "..4", consejo: "Caminá hacia delante", estadoDeLaCarta: false },
  { id: 5, verso: "..5", consejo: "...", estadoDeLaCarta: false },
];