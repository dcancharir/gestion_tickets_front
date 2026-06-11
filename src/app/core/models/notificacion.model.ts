export interface Notificacion {
  notificacionId: number;
  tipo:           string;
  referencia:     string | null;  // "TK-001", "ART-007"… null para notificaciones de sistema
  titulo:         string;
  mensaje:        string;
  leida:          boolean;
  urlDestino:     string | null;  // ruta Angular destino del click; null = sin redirección
  fechaCreacion:  Date;
}
