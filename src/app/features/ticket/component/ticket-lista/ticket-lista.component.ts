import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { FormsModule }                from '@angular/forms';
import { Router, ActivatedRoute }     from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { TicketListItem }             from '../../model/ticket.model';
import { TicketCrearModalComponent }  from '../ticket-crear-modal/ticket-crear-modal';
 
type ModoLista = 'todos' | 'mis-tickets' | 'mis-asignaciones';
 
@Component({
  selector:    'app-ticket-lista',
  standalone:  true,
  imports:     [CommonModule, FormsModule, TicketCrearModalComponent],
  templateUrl: './ticket-lista.html',
  styleUrls:   ['./ticket-lista.css']
})
export class TicketListaComponent implements OnInit {
 
  readonly svc    = inject(TicketService);
  readonly router = inject(Router);
  readonly route  = inject(ActivatedRoute);
 
  modo: ModoLista = 'todos';
 
  get busqueda()         { return this.svc.filtroBusqueda(); }
  set busqueda(v)        { this.svc.filtroBusqueda.set(v); }
  get filtroEstado()     { return this.svc.filtroEstado(); }
  set filtroEstado(v)    { this.svc.filtroEstado.set(v); }
  get filtroPrioridad()  { return this.svc.filtroPrioridad(); }
  set filtroPrioridad(v) { this.svc.filtroPrioridad.set(v); }
 
  get estadosUnicos(): string[] {
    return [...new Set(this.svc.tickets().map(t => t.estado))].sort();
  }
 
  get prioridadesUnicas(): string[] {
    return [...new Set(this.svc.tickets().map(t => t.prioridad))];
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
 
  prioridadClass(nivel: number): string {
    return ['','badge-critico','badge-alto','badge-medio',
            'badge-bajo','badge-planificado'][nivel] ?? 'badge-bajo';
  }
 
  estadoClass(estado: string): string {
    const map: Record<string, string> = {
      'Registrado': 'estado-chip-registrado', 'Asignado': 'estado-chip-asignado',
      'En Diagnóstico': 'estado-chip-diagnostico', 'En Progreso': 'estado-chip-progreso',
      'Pendiente': 'estado-chip-pendiente', 'Resuelto': 'estado-chip-resuelto',
      'Cerrado': 'estado-chip-cerrado', 'Reabierto': 'estado-chip-reabierto',
      'Cancelado': 'estado-chip-cancelado',
    };
    return map[estado] ?? '';
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
 
  kanbanColor(estado: string): string {
    const map: Record<string, string> = {
      'Registrado': '#d7691c', 'Asignado': '#e8843a',
      'En Diagnóstico': '#bf391c', 'En Progreso': '#c25a1a',
      'Pendiente': '#7a6a5a', 'Resuelto': '#d7691c',
      'Cerrado': '#4a3a2a', 'Reabierto': '#bf391c',
    };
    return map[estado] ?? '#7a6a5a';
  }
}