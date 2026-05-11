export interface Notificacion {
  tipo:           string;   // "Asignación" | "Escalamiento"
  ticketPublicId: string;
  numeroTicket:   string;
  titulo:         string;
  mensaje:        string;
  leida:          boolean;
  fecha:          Date;
}
