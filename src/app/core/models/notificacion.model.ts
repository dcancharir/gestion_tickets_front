export interface Notificacion {
  notificacionId:  number;
  tipo:            string;   // "Asignación" | "Escalamiento" | "SLA Incumplido"
  ticketPublicId:  string;
  numeroTicket:    string;
  titulo:          string;
  mensaje:         string;
  leida:           boolean;
  fechaCreacion:   Date;
}
