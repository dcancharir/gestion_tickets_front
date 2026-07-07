export interface ReportesData {
  // Contexto
  totalTickets:      number;
  ticketsResueltos:  number;
  ticketsCerrados:   number;
  // D1 — Tiempo de atención
  tiempoPromedioRespuestaMinutos:   number | null;
  tiempoPromedioResolucionMinutos:  number | null;
  porcentajeCumplimientoSla:        number | null;
  // D2 — Solución brindada
  valoracionPromedio:   number | null;
  tasaReaperturasPct:   number | null;
  // D3 — Comunicación y seguimiento
  promedioComentariosPorTicket:              number | null;
  promedioActualizacionesHistorialPorTicket: number | null;
}
