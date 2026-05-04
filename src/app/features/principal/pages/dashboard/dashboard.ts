import { Component,inject } from "@angular/core";
import { CommonModule } from '@angular/common';
import { DashboardService } from "../../services/dashboard.service";
@Component({
    selector : 'app-dashboard',
    templateUrl : './dashboard.html',
    styleUrl:'./dashboard.css',
    imports:     [CommonModule],
})
export class Dashboard {
    readonly svc = inject(DashboardService);
    constructor(){
        this.svc.cargar()
    }
 // ── Helpers de formato ─────────────────────────────────────────────────────
 
  formatMinutos(min: number | null): string {
    if (min === null) return '—';
    if (min < 60)   return `${Math.round(min)} min`;
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
 
  formatPct(val: number | null): string {
    return val === null ? '—' : `${val}%`;
  }
 
  // Color semáforo para SLA: rojo < 70, amarillo < 90, verde >= 90
  slaClass(val: number | null): string {
    if (val === null) return 'text-secondary';
    if (val >= 90)   return 'kpi-verde';
    if (val >= 70)   return 'kpi-amarillo';
    return 'kpi-rojo';
  }
 
  // Ancho de barra para distribuciones
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
      'Crítico':     'badge-critico',
      'Alto':        'badge-alto',
      'Medio':       'badge-medio',
      'Bajo':        'badge-bajo',
      'Planificado': 'badge-planificado'
    };
    return map[nombre] ?? 'badge-bajo';
  }
}