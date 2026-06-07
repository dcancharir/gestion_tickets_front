import { Component, inject, signal, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SignalrService } from '../../core/services/signalr.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { LayoutService } from '../../core/services/layout.service';
import { AuthResponse } from '../../core/models/auth-response';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [DatePipe]
})
export class Header {
  service     = inject(AuthService);
  signalrSvc  = inject(SignalrService);
  notifSvc    = inject(NotificacionService);
  layoutSvc   = inject(LayoutService);
  private router = inject(Router);

  user = signal<AuthResponse | null>(null);
  showNotif = signal(false);
  showUser  = signal(false);

  constructor() {
    if (this.service.isLogged()) {
      this.user.set(this.service.getUserInfo());
      this.notifSvc.cargar();
    }
  }

  /** Hamburger: colapsa en desktop, abre/cierra drawer en móvil */
  onToggleMenu(): void {
    if (window.innerWidth > 1080) {
      this.layoutSvc.toggleCollapsed();
    } else {
      this.layoutSvc.toggleMobile();
    }
  }

  toggleNotif(event: Event): void {
    event.stopPropagation();
    this.showNotif.update(v => !v);
    this.showUser.set(false);
  }

  toggleUser(event: Event): void {
    event.stopPropagation();
    this.showUser.update(v => !v);
    this.showNotif.set(false);
  }

  @HostListener('document:click')
  closeAll(): void {
    this.showNotif.set(false);
    this.showUser.set(false);
  }

  irAlTicket(notificacionId: number, ticketPublicId: string): void {
    this.notifSvc.marcarLeida(notificacionId);
    this.showNotif.set(false);
    this.router.navigate(['/tickets', ticketPublicId]);
  }

  logout(event: Event): void {
    event.preventDefault();
    this.showUser.set(false);
    this.signalrSvc.disconnect();
    this.notifSvc.limpiarTodas();
    this.service.logout();
  }

  avatarInitial(): string {
    return this.user()?.nombre?.charAt(0)?.toUpperCase() ?? '?';
  }

  avatarColor(): string {
    const colors = ['av-c0','av-c1','av-c2','av-c3','av-c4','av-c5'];
    const name = this.user()?.nombre ?? '';
    return colors[name.charCodeAt(0) % colors.length] ?? 'av-c0';
  }
}
