import { Injectable, computed, signal } from '@angular/core';
import { Notificacion } from '../models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificacionService {

  readonly notificaciones = signal<Notificacion[]>([]);

  readonly sinLeer = computed(() =>
    this.notificaciones().filter(n => !n.leida).length
  );

  agregar(payload: Omit<Notificacion, 'leida' | 'fecha'>): void {
    this.notificaciones.update(list => [
      { ...payload, leida: false, fecha: new Date() },
      ...list
    ]);
  }

  marcarLeida(ticketPublicId: string): void {
    this.notificaciones.update(list =>
      list.map(n =>
        n.ticketPublicId === ticketPublicId ? { ...n, leida: true } : n
      )
    );
  }

  limpiarTodas(): void {
    this.notificaciones.set([]);
  }
}
