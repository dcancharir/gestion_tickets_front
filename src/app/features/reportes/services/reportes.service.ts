import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ReportesData } from '../models/reportes.model';
import { ReporteDistribucion } from '../models/distribucion.model';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private http = inject(HttpClient);
  private api  = environment.api_url;

  readonly data         = signal<ReportesData | null>(null);
  readonly distribucion = signal<ReporteDistribucion | null>(null);
  readonly cargando     = signal(false);
  readonly cargandoDist = signal(false);
  readonly error        = signal<string | null>(null);

  cargar(desde: string, hasta: string): void {
    this.cargando.set(true);
    this.error.set(null);
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    this.http.get<ReportesData>(`${this.api}api/reportes`, { params }).subscribe({
      next:  d  => { this.data.set(d); this.cargando.set(false); },
      error: () => { this.error.set('No se pudieron cargar los reportes.'); this.cargando.set(false); }
    });
  }

  cargarDistribucion(): void {
    this.cargandoDist.set(true);
    this.distribucion.set(null);
    this.http.get<ReporteDistribucion>(`${this.api}api/reportes/distribucion`).subscribe({
      next:  d  => { this.distribucion.set(d); this.cargandoDist.set(false); },
      error: () => { this.cargandoDist.set(false); }
    });
  }
}
