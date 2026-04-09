export interface LetraInteractiva {
  idDeLaLetra: string;
  caracterIndividual: string;
  posicionEnEjeHorizontal: number; 
  posicionEnEjeVertical: number;   
  nivelDeOpacidadVisual: number;     
  yaFueGritadaConExito: boolean; 
}

export const poemaCompletoParaObtener = "Los perezosos ambicionan mucho y obtienen poco, pero los que trabajan con esmero prosperarán";