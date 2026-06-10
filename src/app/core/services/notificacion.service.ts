import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notificacion } from '../models/notificacion.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private http = inject(HttpClient);
  private api  = environment.api_url;

  readonly notificaciones = signal<Notificacion[]>([]);

  readonly sinLeer = computed(() =>
    this.notificaciones().filter(n => !n.leida).length
  );

  /** Carga las notificaciones no leídas desde la BD. Llamar al iniciar sesión. */
  cargar(): void {
    this.http.get<Notificacion[]>(`${this.api}api/notificacion/mis-notificaciones`)
      .subscribe(lista => this.notificaciones.set(lista));
  }

  /** Recibe una notificación en tiempo real via SignalR y la agrega al estado.
   *  El payload ya llega en camelCase (SignalR configurado con JsonNamingPolicy.CamelCase).
   */
  agregar(payload: any): void {
    const notif: Notificacion = {
      notificacionId: payload.notificacionId,
      tipo:           payload.tipo,
      ticketPublicId: payload.ticketPublicId,
      numeroTicket:   payload.numeroTicket,
      titulo:         payload.titulo,
      mensaje:        payload.mensaje,
      leida:          payload.leida ?? false,
      fechaCreacion:  payload.fechaCreacion
    };
    this.notificaciones.update(list => [notif, ...list]);
  }

  /** Marca una notificación como leída en BD y en el estado local. */
  marcarLeida(id: number): void {
    this.http.put(`${this.api}api/notificacion/${id}/leer`, {})
      .subscribe(() => {
        this.notificaciones.update(list =>
          list.map(n => n.notificacionId === id ? { ...n, leida: true } : n)
        );
      });
  }

  /** Marca todas las notificaciones como leídas en BD y en el estado local. */
  marcarTodasLeidas(): void {
    this.http.put(`${this.api}api/notificacion/leer-todas`, {})
      .subscribe(() => {
        this.notificaciones.update(list =>
          list.map(n => ({ ...n, leida: true }))
        );
      });
  }

  /** Limpia el estado local sin tocar la BD (usado en logout). */
  limpiarTodas(): void {
    this.notificaciones.set([]);
  }
}
