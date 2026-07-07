import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReportesService } from '../../services/reportes.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector:    'app-distribucion',
  templateUrl: './distribucion.html',
  styleUrl:    './distribucion.css',
  imports:     [CommonModule],
})
export class DistribucionComponent implements OnInit {
  readonly svc  = inject(ReportesService);
  private  http = inject(HttpClient);
  private  api  = environment.api_url;

  exportando = signal(false);

  ngOnInit(): void { this.svc.cargarDistribucion(); }

  formatMinutos(min: number | null): string {
    if (min === null) return '—';
    if (min < 60) return `${Math.round(min)} min`;
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  exportarExcel(): void {
    this.exportando.set(true);
    this.http
      .get(`${this.api}api/reportes/distribucion/excel`, { responseType: 'blob' })
      .subscribe({
        next: blob => {
          const url = URL.createObjectURL(blob);
          const a   = document.createElement('a');
          a.href     = url;
          a.download = `distribucion-tickets-${new Date().toISOString().substring(0, 10)}.xlsx`;
          a.click();
          URL.revokeObjectURL(url);
          this.exportando.set(false);
        },
        error: () => this.exportando.set(false),
      });
  }
}
