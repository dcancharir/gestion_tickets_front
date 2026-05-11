import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { NotificacionService } from './notificacion.service';

@Injectable({ providedIn: 'root' })
export class SignalrService {

  private connection: HubConnection | null = null;
  private notifSvc = inject(NotificacionService);

  constructor() {
    // Reconectar automáticamente si la página se recarga con sesión activa
    if (this.getToken()) {
      this.connect();
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('TOKEN_KEY');
  }

  connect(): void {
    if (this.connection?.state === HubConnectionState.Connected ||
        this.connection?.state === HubConnectionState.Connecting) {
      return;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.api_url}hubs/notificaciones`, {
        accessTokenFactory: () => this.getToken() ?? ''
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on('RecibirNotificacion', (notif) => {
      this.notifSvc.agregar(notif);
    });

    this.connection.start()
      .catch(err => console.error('[SignalR] Error al conectar:', err));
  }

  disconnect(): void {
    this.connection?.stop();
    this.connection = null;
  }
}
