import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SignalrService } from '../../core/services/signalr.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { AuthResponse } from '../../core/models/auth-response';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [CommonModule]
})
export class Header {
  service     = inject(AuthService);
  signalrSvc  = inject(SignalrService);
  notifSvc    = inject(NotificacionService);
  private router = inject(Router);

  user = signal<AuthResponse | null>(null);

  constructor() {
    if (this.service.isLogged()) {
      this.user.set(this.service.getUserInfo());
      // Cargar notificaciones no leídas desde BD al montar el header
      this.notifSvc.cargar();
    }
  }

  irAlTicket(notificacionId: number, ticketPublicId: string): void {
    this.notifSvc.marcarLeida(notificacionId);
    this.router.navigate(['/tickets', ticketPublicId]);
  }

  logout(event: any): void {
    event.preventDefault();
    this.signalrSvc.disconnect();
    this.notifSvc.limpiarTodas();
    this.service.logout();
  }
}
