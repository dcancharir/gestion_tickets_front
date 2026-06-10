export interface ResumenEstados {
  total:         number;
  registrados:   number;
  asignados:     number;
  enDiagnostico: number;
  enProgreso:    number;
  pendientes:    number;
  resueltos:     number;
  cerrados:      number;
  reabiertas:    number;
  cancelados:    number;
}
 
export interface KpisItil {
  mttrPromedioMinutos:               number | null;
  mttrRespuestaPromedioMinutos:      number | null;
  porcentajeCumplimientoSla:         number | null;
  porcentajeResolucionPrimerContacto: number | null;
  porcentajeReincidencia:            number | null;
  resueltos7d:                       number;
  resueltosAnterior7d:               number;
}

export interface TendenciaDia {
  fecha:      string;
  registrados: number;
  resueltos:   number;
}
 
export interface ConteoItem {
  nombre: string;
  total:  number;
}
 
export interface KpiTecnico {
  tecnico:                   string;
  totalAsignados:            number;
  resueltos:                 number;
  cerrados:                  number;
  mttrPromedioMinutos:       number | null;
  porcentajeCumplimientoSla: number | null;
  porcentajePrimerContacto:  number | null;
}
 
export interface DashboardKpi {
  estados:      ResumenEstados;
  kpisItil:     KpisItil;
  porCategoria: ConteoItem[];
  porPrioridad: ConteoItem[];
  topTecnicos:  KpiTecnico[];
}

// ── Dashboard del Técnico ─────────────────────────────────────────────────────

export interface ResumenTecnico {
  totalAsignados: number;
  enProgreso:     number;
  pendientes:     number;
  resueltosHoy:  number;
  criticos:       number;
}

export interface TicketResumen {
  publicId:             string;
  numeroTicket:         string;
  titulo:               string;
  estado:               string;
  prioridad:            string;
  fechaRegistro:        string;
  fechaLimiteResolucion: string | null;
}

export interface DashboardKpiTecnico {
  misTickets:         ResumenTecnico;
  miMttrMinutos:      number | null;
  miSla:              number | null;
  miPrimerContacto:   number | null;
  proximosAVencerSla: TicketResumen[];
  criticosAbiertos:   TicketResumen[];
}