import { Component, OnInit, inject, resource, signal } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { FormsModule }                from '@angular/forms';
import { Router, ActivatedRoute }     from '@angular/router';
import { firstValueFrom }             from 'rxjs';
import { TicketService }              from '../../services/ticket.service';
import { TicketListItem }             from '../../model/ticket.model';
import { TicketCrearModalComponent }  from '../ticket-crear-modal/ticket-crear-modal';
import { EstadoService }              from '../../../maintenance/services/estado.service';
import { PrioridadService }           from '../../../maintenance/services/prioridad.service';

type ModoLista = 'todos' | 'mis-tickets' | 'mis-asignaciones';

@Component({
  selector:    'app-ticket-lista',
  standalone:  true,
  imports:     [CommonModule, FormsModule, TicketCrearModalComponent],
  templateUrl: './ticket-lista.html',
  styleUrls:   ['./ticket-lista.css']
})
export class TicketListaComponent implements OnInit {

  readonly svc         = inject(TicketService);
  readonly router      = inject(Router);
  readonly route       = inject(ActivatedRoute);
  private estadoSvc    = inject(EstadoService);
  private prioridadSvc = inject(PrioridadService);

  modo: ModoLista  = 'todos';
  showModal        = signal(false);

  estados   = resource({ loader: () => firstValueFrom(this.estadoSvc.getAll()) });
  prioridades = resource({ loader: () => firstValueFrom(this.prioridadSvc.getAll()) });

  get busqueda()         { return this.svc.filtroBusqueda(); }
  set busqueda(v)        { this.svc.filtroBusqueda.set(v); }
  get filtroEstado()     { return this.svc.filtroEstado(); }
  set filtroEstado(v)    { this.svc.filtroEstado.set(v); }
  get filtroPrioridad()  { return this.svc.filtroPrioridad(); }
  set filtroPrioridad(v) { this.svc.filtroPrioridad.set(v); }
 
  get prioridadesDistintas() {
    if (this.prioridades.error()) return [];
    const vistas = new Set<string>();
    return (this.prioridades.value() ?? []).filter(p => {
      if (vistas.has(p.nombre)) return false;
      vistas.add(p.nombre);
      return true;
    });
  }

  get titulo(): string {
    return { 'todos': 'Todos los Tickets',
             'mis-tickets': 'Mis Tickets',
             'mis-asignaciones': 'Mis Asignaciones' }[this.modo];
  }
 
  ngOnInit(): void {
    this.modo = (this.route.snapshot.data['modo'] as ModoLista) ?? 'todos';
    this.svc.limpiarFiltros();
    const cargadores: Record<ModoLista, () => void> = {
      'todos':            () => this.svc.cargarTodos(),
      'mis-tickets':      () => this.svc.cargarMisTickets(),
      'mis-asignaciones': () => this.svc.cargarMisAsignaciones()
    };
    cargadores[this.modo]();
  }
 
  verDetalle(ticket: TicketListItem): void {
    this.router.navigate(['/tickets', ticket.publicId]);
  }
 
  onTicketCreado(ticket: TicketListItem): void {
    this.svc.tickets.update(lista => [ticket, ...lista]);
  }
 
  estadoColor(nombre: string): string {
    if (this.estados.error()) return '#7a6a5a';
    return (this.estados.value() ?? []).find(e => e.nombre === nombre)?.colorHexa ?? '#7a6a5a';
  }

  prioridadColor(nombre: string): string {
    if (this.prioridades.error()) return '#7a6a5a';
    return (this.prioridades.value() ?? []).find(p => p.nombre === nombre)?.colorHexa ?? '#7a6a5a';
  }


  slaClass(ticket: TicketListItem): string {
    if (ticket.esEstadoFinal) return ticket.cumpleSla ? 'sla-ok' : 'sla-fail';
    if (!ticket.fechaLimiteResolucion) return '';
    const diff = (new Date(ticket.fechaLimiteResolucion).getTime() - Date.now()) / 60000;
    if (diff < 0)  return 'sla-fail';
    if (diff < 60) return 'sla-warn';
    return 'sla-ok';
  }
 
  slaTexto(ticket: TicketListItem): string {
    if (!ticket.fechaLimiteResolucion) return '—';
    const diff = Math.round(
      (new Date(ticket.fechaLimiteResolucion).getTime() - Date.now()) / 60000);
    if (ticket.esEstadoFinal) return ticket.cumpleSla ? 'Cumplido' : 'Vencido';
    if (diff < 0)  return `Vencido ${Math.abs(diff)}m`;
    if (diff < 60) return `${diff}m restantes`;
    return `${Math.floor(diff / 60)}h restantes`;
  }
 
  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
 
}