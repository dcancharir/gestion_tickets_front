import { Component, inject, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule }    from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService }      from '../../../../core/services/auth.service';

@Component({
  selector:    'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl:    './dashboard.css',
  imports:     [CommonModule, RouterModule],
})
export class Dashboard implements OnInit {
  readonly svc      = inject(DashboardService);
  readonly authSvc  = inject(AuthService);

  // Rol del usuario autenticado ("Administrador" | "Técnico" | "Solicitante")
  readonly rol = this.authSvc.getUserInfo()?.rol ?? '';

  ngOnInit(): void {
    if (this.rol === 'Técnico') {
      this.svc.cargarTecnico();
    } else {
      this.svc.cargar();
    }
  }

  // ── Helpers compartidos ────────────────────────────────────────────────────

  formatMinutos(min: number | null): string {
    if (min === null) return '—';
    if (min < 60) return `${Math.round(min)} min`;
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  formatPct(val: number | null): string {
    return val === null ? '—' : `${val}%`;
  }

  slaClass(val: number | null): string {
    if (val === null) return 'text-secondary';
    if (val >= 90)   return 'kpi-verde';
    if (val >= 70)   return 'kpi-amarillo';
    return 'kpi-rojo';
  }

  barWidth(total: number, max: number): string {
    if (max === 0) return '0%';
    return `${Math.round((total / max) * 100)}%`;
  }

  maxCategoria(): number {
    const items = this.svc.data()?.porCategoria ?? [];
    return items.length ? Math.max(...items.map(i => i.total)) : 0;
  }

  maxPrioridad(): number {
    const items = this.svc.data()?.porPrioridad ?? [];
    return items.length ? Math.max(...items.map(i => i.total)) : 0;
  }

  prioridadClass(nombre: string): string {
    const map: Record<string, string> = {
      'Crítico': 'badge-critico', 'Alto':  'badge-alto',
      'Medio':   'badge-medio',   'Bajo':  'badge-bajo',
    };
    return map[nombre] ?? 'badge-bajo';
  }

  // Tiempo restante hasta fecha límite SLA (texto corto)
  tiempoRestante(fechaLimite: string | null): string {
    if (!fechaLimite) return '—';
    const diff = new Date(fechaLimite).getTime() - Date.now();
    if (diff <= 0) return 'Vencido';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  }

  tiempoRestanteClass(fechaLimite: string | null): string {
    if (!fechaLimite) return '';
    const diff = new Date(fechaLimite).getTime() - Date.now();
    if (diff <= 0)           return 'kpi-rojo';
    if (diff <= 3600000)     return 'kpi-rojo';     // < 1h
    if (diff <= 7200000)     return 'kpi-amarillo';  // < 2h
    return 'kpi-verde';
  }
}
