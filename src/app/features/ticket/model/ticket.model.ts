export interface TicketListItem {
  publicId:                 string;
  numeroTicket:             string;
  titulo:                   string;
  categoria:                string;
  prioridad:                string;
  nivelPrioridad:           number;
  estado:                   string;
  esEstadoFinal:            boolean;
  solicitante:              string;
  tecnico:                  string | null;
  fechaRegistro:            string;
  fechaLimiteResolucion:    string | null;
  cumpleSla:                boolean | null;
  resueltoEnPrimerContacto: boolean;
}
 
export interface HistorialItem {
  accion:         string;
  estadoAnterior: string | null;
  estadoNuevo:    string | null;
  detalle:        string | null;
  usuario:        string;
  fechaAccion:    string;
}
 
export interface ComentarioItem {
  mensaje:         string;
  esInterno:       boolean;
  usuario:         string;
  usuarioPublicId: string;
  fechaComentario: string;
}

export interface AdjuntoItem {
  idIncidenciaAdjunto: number;
  idIncidencia:        number;
  nombre:              string;
  rutaContenedora:     string;
  nombreReal:          string;
  fechaCreacion:       string;
}
 
export interface TicketDetalle {
  publicId:                   string;
  numeroTicket:               string;
  titulo:                     string;
  descripcion:                string;
  categoria:                  string;
  canalReporte:               string;
  prioridad:                  string;
  nivelPrioridad:             number;
  impacto:                    string;
  urgencia:                   string;
  estado:                     string;
  esEstadoFinal:              boolean;
  solicitante:                string;
  solicitantePublicId:        string;
  tecnico:                    string | null;
  tecnicoPublicId:            string | null;
  fechaRegistro:              string;
  fechaAsignacion:            string | null;
  fechaLimiteRespuesta:       string | null;
  fechaLimiteResolucion:      string | null;
  fechaPrimeraRespuesta:      string | null;
  fechaResolucion:            string | null;
  fechaCierre:                string | null;
  solucionAplicada:           string | null;
  resueltoEnPrimerContacto:   boolean;
  numeroReasignaciones:       number;
  cumpleSla:                  boolean | null;
  sedeId:                     number;
  sede:                       string | null;
  historial:                  HistorialItem[];
  comentarios:                ComentarioItem[];
  adjuntos:                   AdjuntoItem[];
}
 
// ── Requests ──────────────────────────────────────────────────────────────────
 
export interface CrearTicketRequest {
  titulo:       string;
  descripcion:  string;
  categoriaId:  number;
  canalReporte: string;
  impacto:      number;
  urgencia:     number;
  prioridadId:  number;
  sedeId:       number;
}
 
export interface AsignarTicketRequest {
  tecnicoPublicId: string;
}
 
export interface CambiarEstadoRequest {
  nuevoEstadoId: number;
  detalle:       string;
}
 
export interface ResolverTicketRequest {
  solucionAplicada:          string;
  resueltoEnPrimerContacto:  boolean;
}
 
export interface CerrarTicketRequest {
  comentario?: string;
}
 
export interface EscalarTicketRequest {
  tecnicoPublicId: string;
  motivo:          string;
}
 
export interface ReabrirTicketRequest {
  motivo: string;
}
 
export interface AgregarComentarioRequest {
  mensaje:    string;
  esInterno:  boolean;
}
 
// ── Catálogos ─────────────────────────────────────────────────────────────────
 
export interface CatalogoItem {
  id:     number;
  nombre: string;
}
 
export interface UsuarioBasico {
  publicId:  string;
  nombre:    string;
  apellidos: string;
  email:     string;
  rolNombre: string;
}