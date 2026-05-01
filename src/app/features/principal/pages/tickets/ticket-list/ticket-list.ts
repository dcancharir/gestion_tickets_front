import { Component, inject, resource, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Incidencia } from "../../../models/incidencia.model";
import { IncidenciaService } from "../../../services/incidencia.service";
import { firstValueFrom } from "rxjs";
import { TicketAddEdit } from "../ticket-add/ticket-add-edit";
import { IncidenciaCreate } from "../../../models/incidencia-create.model";
import { Router } from "@angular/router";
@Component({
    selector : 'app-ticket-list',
    templateUrl : './ticket-list.html',
      imports: [CommonModule,TicketAddEdit],
})
export class TicketList {
      modalAbierto = signal(false)
      incidenciaSeleccionada = signal<IncidenciaCreate|null>(null)
  private incidenciaService = inject(IncidenciaService)
  private router = inject(Router)
  viewMode = signal<'grid' | 'list'>('grid');

  setView(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }
  incidencias = resource({
    loader : ()=>firstValueFrom(this.incidenciaService.getAll())
  })
  truncateByChars(text: string | null | undefined, maxLength: number): string {
    if(text == null){
      return ''
    }
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }
   openModal(incidencia:IncidenciaCreate | null){
          this.incidenciaSeleccionada.set(incidencia);
          this.modalAbierto.set(true);
  }
  onGuardado(incidencia : Incidencia){
      this.modalAbierto.set(false);
      this.incidencias.reload();
  }
  viewDetails(publicId : string){
    this.router.navigate(['/principal/ticket-detail', publicId])
  }
  getPriorityClass(prioridad: number | string): string {
    switch (prioridad) {
      case 1:
      case 'Crítico':
        return 'danger';

      case 2:
      case 'Alto':
        return 'warning';

      case 3:
      case 'Medio':
        return 'primary';

      case 4:
      case 'Bajo':
        return 'secondary';

      case 5:
      case 'Planificado':
        return 'success';

      default:
        return 'dark';
    }
  }
  getEstadoClass(estado: number | string): string {
    switch (estado) {
      case 1:
      case 'Registrado':
        return 'secondary';

      case 2:
      case 'Asignado':
        return 'info';

      case 3:
      case 'En Diagnóstico':
        return 'primary';

      case 4:
      case 'En Progreso':
        return 'warning';

      case 5:
      case 'Pendiente':
        return 'muted';

      case 6:
      case 'Resuelto':
        return 'success';

      case 7:
      case 'Cerrado':
        return 'dark';

      case 8:
      case 'Reabierto':
        return 'danger';

      case 9:
      case 'Cancelado':
        return 'danger';

      default:
        return 'dark';
    }
  }
}