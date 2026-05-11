import { Injectable, signal, computed } from '@angular/core';
import { HttpClient }                    from '@angular/common/http';
import { environment }                   from '../../../../environments/environment';
import {
  TicketListItem, TicketDetalle,
  CrearTicketRequest, AsignarTicketRequest,
  CambiarEstadoRequest, ResolverTicketRequest,
  CerrarTicketRequest, EscalarTicketRequest,
  ReabrirTicketRequest, AgregarComentarioRequest,
  ComentarioItem
} from '../model/ticket.model';
 
@Injectable({ providedIn: 'root' })
export class TicketService {
 
  private readonly base = `${environment.api_url}api/incidencias`;
 
  // ── State ──────────────────────────────────────────────────────────────────
  readonly tickets      = signal<TicketListItem[]>([]);
  readonly detalle      = signal<TicketDetalle | null>(null);
  readonly cargando     = signal(false);
  readonly cargandoDet  = signal(false);
  readonly error        = signal<string | null>(null);
 
  // ── Filtros activos ────────────────────────────────────────────────────────
  readonly filtroEstado    = signal<string>('');
  readonly filtroPrioridad = signal<string>('');
  readonly filtroBusqueda  = signal<string>('');
 
  // ── Vista activa: 'tabla' | 'tarjetas' ────────────────────────────────────
  readonly vistaActiva = signal<'tabla' | 'tarjetas'>('tabla');
 
  // ── Computed: tickets filtrados ────────────────────────────────────────────
  readonly ticketsFiltrados = computed(() => {
    let lista = this.tickets();
    const estado    = this.filtroEstado();
    const prioridad = this.filtroPrioridad();
    const busqueda  = this.filtroBusqueda().toLowerCase();
 
    if (estado)    lista = lista.filter(t => t.estado === estado);
    if (prioridad) lista = lista.filter(t => t.prioridad === prioridad);
    if (busqueda)  lista = lista.filter(t =>
      t.numeroTicket.toLowerCase().includes(busqueda) ||
      t.titulo.toLowerCase().includes(busqueda) ||
      t.solicitante.toLowerCase().includes(busqueda) ||
      (t.tecnico ?? '').toLowerCase().includes(busqueda)
    );
 
    return lista;
  });
 
  // Tickets agrupados por estado (para vista kanban)
  readonly ticketsPorEstado = computed(() => {
    const estados = ['Registrado','Asignado','En Diagnóstico','En Progreso',
                     'Pendiente','Resuelto','Cerrado','Reabierto'];
    const lista   = this.ticketsFiltrados();
    return estados.map(e => ({
      estado:   e,
      tickets:  lista.filter(t => t.estado === e),
      cantidad: lista.filter(t => t.estado === e).length
    })).filter(g => g.tickets.length > 0);
  });
 
  constructor(private http: HttpClient) {}
 
  // ── Cargar listas ──────────────────────────────────────────────────────────
 
  cargarTodos(): void {
    this._cargar(`${this.base}`);
  }
 
  cargarMisTickets(): void {
    this._cargar(`${this.base}/mis-tickets`);
  }
 
  cargarMisAsignaciones(): void {
    this._cargar(`${this.base}/mis-asignaciones`);
  }
 
  private _cargar(url: string): void {
    this.cargando.set(true);
    this.error.set(null);
    this.http.get<TicketListItem[]>(url).subscribe({
      next:  data  => { this.tickets.set(data);  this.cargando.set(false); },
      error: ()    => { this.error.set('No se pudo cargar los tickets.'); this.cargando.set(false); }
    });
  }
 
  cargarDetalle(publicId: string): void {
    this.cargandoDet.set(true);
    this.detalle.set(null);
    this.http.get<TicketDetalle>(`${this.base}/${publicId}`).subscribe({
      next:  data => { this.detalle.set(data); this.cargandoDet.set(false); },
      error: ()   => { this.error.set('No se pudo cargar el ticket.'); this.cargandoDet.set(false); }
    });
  }
 
  // ── Acciones ───────────────────────────────────────────────────────────────
 
  crear(dto: CrearTicketRequest) {
    return this.http.post<TicketListItem>(this.base, dto);
  }
 
  asignar(publicId: string, dto: AsignarTicketRequest) {
    return this.http.patch<TicketListItem>(`${this.base}/${publicId}/asignar`, dto);
  }
 
  cambiarEstado(publicId: string, dto: CambiarEstadoRequest) {
    return this.http.patch<TicketListItem>(`${this.base}/${publicId}/estado`, dto);
  }
 
  resolver(publicId: string, dto: ResolverTicketRequest) {
    return this.http.patch<TicketListItem>(`${this.base}/${publicId}/resolver`, dto);
  }
 
  cerrar(publicId: string, dto: CerrarTicketRequest) {
    return this.http.patch<TicketListItem>(`${this.base}/${publicId}/cerrar`, dto);
  }
 
  escalar(publicId: string, dto: EscalarTicketRequest) {
    return this.http.patch<TicketListItem>(`${this.base}/${publicId}/escalar`, dto);
  }
 
  reabrir(publicId: string, dto: ReabrirTicketRequest) {
    return this.http.patch<TicketListItem>(`${this.base}/${publicId}/reabrir`, dto);
  }
 
  agregarComentario(publicId: string, dto: AgregarComentarioRequest) {
    return this.http.post<ComentarioItem>(`${this.base}/${publicId}/comentarios`, dto);
  }
 
  // ── Helpers de vista ───────────────────────────────────────────────────────
 
  toggleVista(): void {
    this.vistaActiva.update(v => v === 'tabla' ? 'tarjetas' : 'tabla');
  }
 
  limpiarFiltros(): void {
    this.filtroEstado.set('');
    this.filtroPrioridad.set('');
    this.filtroBusqueda.set('');
  }
 
  // Actualiza el ticket en la lista local tras una acción sin recargar todo
  actualizarEnLista(actualizado: TicketListItem): void {
    this.tickets.update(lista =>
      lista.map(t => t.publicId === actualizado.publicId ? actualizado : t)
    );
  }
 
  removerDeLista(publicId: string): void {
    this.tickets.update(lista => lista.filter(t => t.publicId !== publicId));
  }
}