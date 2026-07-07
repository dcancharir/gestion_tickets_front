import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';

@Component({
  selector:    'app-reportes',
  templateUrl: './reportes.html',
  styleUrl:    './reportes.css',
  imports:     [CommonModule, FormsModule],
})
export class ReportesComponent implements OnInit {
  readonly svc = inject(ReportesService);

  // Rango de fechas por defecto: último mes
  desde = this.isoDate(new Date(Date.now() - 30 * 86400_000));
  hasta = this.isoDate(new Date());

  ngOnInit(): void { this.svc.cargar(this.desde, this.hasta); }

  aplicar(): void { this.svc.cargar(this.desde, this.hasta); }

  // ── Helpers de formato ────────────────────────────────────────────────────

  private isoDate(d: Date): string { return d.toISOString().substring(0, 10); }

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

  formatNum(val: number | null, decimals = 1): string {
    return val === null ? '—' : val.toFixed(decimals);
  }

  // Estrellas llenas + media + vacías para la valoración
  estrellas(val: number | null): { llenas: number; media: boolean; vacias: number } {
    if (val === null) return { llenas: 0, media: false, vacias: 5 };
    const llenas = Math.floor(val);
    const media  = (val - llenas) >= 0.5;
    const vacias = 5 - llenas - (media ? 1 : 0);
    return { llenas, media, vacias };
  }

  slaClass(val: number | null): string {
    if (val === null) return '';
    if (val >= 90) return 'kpi-verde';
    if (val >= 70) return 'kpi-amarillo';
    return 'kpi-rojo';
  }

  tasaReopeClass(val: number | null): string {
    if (val === null) return '';
    if (val <= 5)  return 'kpi-verde';
    if (val <= 15) return 'kpi-amarillo';
    return 'kpi-rojo';
  }

  valoracionClass(val: number | null): string {
    if (val === null) return '';
    if (val >= 4)   return 'kpi-verde';
    if (val >= 3)   return 'kpi-amarillo';
    return 'kpi-rojo';
  }

  // Barra de progreso proporcional (para SLA y valoración)
  barPct(val: number | null, max: number): string {
    if (val === null) return '0%';
    return `${Math.min(100, Math.round((val / max) * 100))}%`;
  }

}
