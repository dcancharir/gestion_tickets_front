import { Injectable, signal, computed } from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { environment }                  from '../../../../environments/environment';
import { DashboardKpi }                 from '../models/dashboard.model';
 
@Injectable({ providedIn: 'root' })
export class DashboardService {
private api = environment.api_url;
  private readonly _url = `${this.api}api/dashboard/kpis`;
 
  // ── State ──────────────────────────────────────────────────────────────────
  readonly data      = signal<DashboardKpi | null>(null);
  readonly cargando  = signal(false);
  readonly error     = signal<string | null>(null);
 
  // ── Computed helpers ───────────────────────────────────────────────────────
  readonly totalAbiertos = computed(() => {
    const e = this.data()?.estados;
    if (!e) return 0;
    return e.registrados + e.asignados + e.enDiagnostico + e.enProgreso + e.pendientes;
  });
 
  constructor(private http: HttpClient) {}
 
  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
 
    this.http.get<DashboardKpi>(this._url).subscribe({
      next:  data  => { this.data.set(data); this.cargando.set(false); },
      error: err   => {
        this.error.set('No se pudo cargar el dashboard. Intenta nuevamente.');
        this.cargando.set(false);
      }
    });
  }
}