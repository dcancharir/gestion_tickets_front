export interface TicketPorTecnico {
  tecnicoId:  number;
  nombreTecnico: string;
  total:      number;
  resueltos:  number;
  cerrados:   number;
  pendientes: number;
  tiempoPromedioResolucionMinutos: number | null;
}

export interface TicketPorSede {
  sedeId:    number;
  nombreSede: string;
  tipoSede:  string;
  total:     number;
  resueltos: number;
  cerrados:  number;
  pendientes: number;
}

export interface ReporteDistribucion {
  porTecnico: TicketPorTecnico[];
  porSede:    TicketPorSede[];
}
