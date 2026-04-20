export interface IncidenciaDetail {
  publicId: string;
  numeroTicket: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  canalReporte: string;
  prioridad: string;
  nivelPrioridad: number;
  impacto: string;
  urgencia: string;
  estado: string;
  esEstadoFinal: boolean;
  solicitante: string;
  solicitantePublicId: string;
  tecnico: string;
  tecnicoPublicId: string;
  fechaRegistro: string | Date;
  fechaAsignacion: string | Date;
  fechaLimiteRespuesta: string | Date;
  fechaLimiteResolucion: string | Date;
  fechaPrimeraRespuesta: string | Date;
  fechaResolucion: string | Date;
  fechaCierre: string | Date;
  solucionAplicada: string;
  resueltoEnPrimerContacto: boolean;
  numeroReasignaciones: number;
  cumpleSla: boolean;
  sede: string;
  historial: IncidenciaHistorial[];
  comentarios: IncidenciaComentario[];
}

export interface IncidenciaHistorial {
  accion: string;
  estadoAnterior: string;
  estadoNuevo: string;
  detalle: string;
  usuario: string;
  fechaAccion: string | Date;
}

export interface IncidenciaComentario {
  mensaje: string;
  esInterno: boolean;
  usuario: string;
  usuarioPublicId: string;
  fechaComentario: string | Date;
}