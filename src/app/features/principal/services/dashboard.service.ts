import { Injectable, signal, computed } from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { environment }                  from '../../../../environments/environment';
import { DashboardKpi, DashboardKpiTecnico, TendenciaDia } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly _baseUrl = `${environment.api_url}api/dashboard`;

  // ── Estado — vista Admin ───────────────────────────────────────────────────
  readonly data     = signal<DashboardKpi | null>(null);
  readonly cargando = signal(false);
  readonly error    = signal<string | null>(null);

  // ── Estado — vista Técnico ─────────────────────────────────────────────────
  readonly dataTecnico     = signal<DashboardKpiTecnico | null>(null);
  readonly cargandoTecnico = signal(false);
  readonly errorTecnico    = signal<string | null>(null);

  // ── Tendencia 7 días ───────────────────────────────────────────────────────
  readonly tendencia7d = signal<TendenciaDia[]>([]);

  // ── Computed helpers (vista Admin) ─────────────────────────────────────────
  readonly totalAbiertos = computed(() => {
    const e = this.data()?.estados;
    if (!e) return 0;
    return e.registrados + e.asignados + e.enDiagnostico + e.enProgreso + e.pendientes;
  });

  constructor(private http: HttpClient) {}

  // Carga el dashboard global (Admin)
  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.http.get<DashboardKpi>(`${this._baseUrl}/kpis`).subscribe({
      next:  d   => { this.data.set(d);   this.cargando.set(false); },
      error: ()  => { this.error.set('No se pudo cargar el dashboard.'); this.cargando.set(false); }
    });
    this.http.get<TendenciaDia[]>(`${this._baseUrl}/tendencia-7d`).subscribe({
      next: t => this.tendencia7d.set(t),
      error: () => {}
    });
  }

  // Carga el dashboard personal del Técnico autenticado
  cargarTecnico(): void {
    this.cargandoTecnico.set(true);
    this.errorTecnico.set(null);
    this.http.get<DashboardKpiTecnico>(`${this._baseUrl}/kpis-tecnico`).subscribe({
      next:  d  => { this.dataTecnico.set(d);  this.cargandoTecnico.set(false); },
      error: () => { this.errorTecnico.set('No se pudo cargar tu dashboard.'); this.cargandoTecnico.set(false); }
    });
  }
}
