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