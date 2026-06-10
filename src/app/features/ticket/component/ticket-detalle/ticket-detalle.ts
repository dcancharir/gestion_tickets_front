import { Component, OnInit, inject, signal, resource, effect, HostListener } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient }      from '@angular/common/http';
import { firstValueFrom }  from 'rxjs';
import { TicketService }   from '../../services/ticket.service';
import { EstadoService }   from '../../../maintenance/services/estado.service';
import { PrioridadService } from '../../../maintenance/services/prioridad.service';
import { UserService }     from '../../../maintenance/services/user.service';
import { AuthService }     from '../../../../core/services/auth.service';
import { ToastService }    from '../../../../core/services/toast.service';
import { environment }     from '../../../../../environments/environment';

interface ValoracionDto { valoracionId: number; puntuacion: number; comentario: string | null; fechaValoracion: string; }
 
@Component({
  selector:    'app-ticket-detalle',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './ticket-detalle.html',
  styleUrls:   ['./ticket-detalle.css']
})
export class TicketDetalleComponent implements OnInit {
 
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private http         = inject(HttpClient);
  private auth         = inject(AuthService);
  private toastSvc     = inject(ToastService);
  readonly svc         = inject(TicketService);
  private estadoSvc    = inject(EstadoService);
  private prioridadSvc = inject(PrioridadService);
  private userSvc      = inject(UserService);

  // ── CSAT / Valoración ────────────────────────────────────────────────────
  valoracion      = signal<ValoracionDto | null>(null);
  valoracionCargada = signal(false);
  csatEstrellas   = signal(0);        // estrella hover/seleccionada temporal
  csatSeleccion   = signal(0);        // puntuación confirmada
  csatComentario  = '';
  csatGuardando   = signal(false);
  csatEnviado     = signal(false);

  estados     = resource({ loader: () => firstValueFrom(this.estadoSvc.getAll()) });
  prioridades = resource({ loader: () => firstValueFrom(this.prioridadSvc.getAll()) });

  estadoColor(nombre: string): string {
    if (this.estados.error()) return '#7a6a5a';
    return (this.estados.value() ?? []).find(e => e.nombre === nombre)?.colorHexa ?? '#7a6a5a';
  }

  prioridadColor(nombre: string): string {
    if (this.prioridades.error()) return '#7a6a5a';
    return (this.prioridades.value() ?? []).find(p => p.nombre === nombre)?.colorHexa ?? '#7a6a5a';
  }
 
  // ── Modal Angular-nativo (reemplaza Bootstrap modals) ─────────────────────
  modalActivo        = signal<string>('');
  guardando          = signal(false);
  errorAccion        = signal<string | null>(null);

  abrirModal(id: string): void { this.errorAccion.set(null); this.modalActivo.set(id); }
  cerrarModal(): void          { this.modalActivo.set(''); }

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.modalActivo()) this.cerrarModal(); }

  // ── Estado del formulario de comentarios ───────────────────────────────────
  guardandoComentario = signal(false);
  errorComentario     = signal<string | null>(null);
 
  // ── Formularios de modales ─────────────────────────────────────────────────
  fAsignar   = { tecnicoPublicId: '' };
  fEstado    = { nuevoEstadoId: 3, detalle: '' };
  fResolver  = { solucionAplicada: '', resueltoEnPrimerContacto: false };
  fCerrar    = { comentario: '' };
  fEscalar   = { tecnicoPublicId: '', motivo: '' };
  fReabrir   = { motivo: '' };
  fComentario = { mensaje: '', esInterno: false };
 
  // Técnicos disponibles — filtrados por la sede del ticket
  tecnicos = signal<{ publicId: string; nombre: string }[]>([]);

  constructor() {
    effect(() => {
      const t = this.svc.detalle();
      if (!t?.sedeId) {
        this.tecnicos.set([]);
        return;
      }
      this.userSvc.getBySedeId(t.sedeId).subscribe({
        next: usuarios => {
          this.tecnicos.set(usuarios.map(u => ({
            publicId: u.publicId,
            nombre:   `${u.nombre} ${u.apellidos}`
          })));
        },
        error: () => { this.tecnicos.set([]); }
      });
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('publicId')!;
    this.svc.cargarDetalle(id);
    this.cargarValoracion(id);
  }

  // ── CSAT helpers ─────────────────────────────────────────────────────────

  cargarValoracion(publicId: string): void {
    this.http.get<ValoracionDto>(`${environment.api_url}api/incidencias/${publicId}/valoracion`)
      .subscribe({
        next:  v  => { this.valoracion.set(v);    this.valoracionCargada.set(true); },
        error: () => { this.valoracionCargada.set(true); } // 204 o error → sin valoración aún
      });
  }

  puedeValorar(): boolean {
    const t = this.svc.detalle();
    if (!t) return false;
    const esResueltoOCerrado = t.estado === 'Resuelto' || t.esEstadoFinal;
    const esSolicitante      = t.solicitantePublicId === this.auth.getUserInfo()?.publicId;
    return esResueltoOCerrado && esSolicitante && !this.valoracion() && this.valoracionCargada();
  }

  setEstrella(n: number): void { this.csatSeleccion.set(n); }
  hoverEstrella(n: number): void { this.csatEstrellas.set(n); }
  leaveEstrellas(): void { this.csatEstrellas.set(0); }

  estrellaActiva(n: number): boolean {
    return n <= (this.csatEstrellas() || this.csatSeleccion());
  }

  enviarValoracion(): void {
    if (this.csatSeleccion() === 0) return;
    const t = this.svc.detalle();
    if (!t) return;
    this.csatGuardando.set(true);
    this.http.post<ValoracionDto>(
      `${environment.api_url}api/incidencias/${t.publicId}/valoracion`,
      { puntuacion: this.csatSeleccion(), comentario: this.csatComentario || null }
    ).subscribe({
      next: v => {
        this.valoracion.set(v);
        this.csatEnviado.set(true);
        this.csatGuardando.set(false);
        this.toastSvc.show('¡Gracias por tu valoración!', 'success');
      },
      error: () => {
        this.csatGuardando.set(false);
        this.toastSvc.show('No se pudo enviar la valoración.', 'error');
      }
    });
  }
 
  volver(): void {
    this.router.navigate(['/tickets']);
  }
 
  // ── Acciones ───────────────────────────────────────────────────────────────
 
  ejecutarAsignar(): void {
    const t = this.svc.detalle();
    if (!t || !this.fAsignar.tecnicoPublicId) return;
    this._ejecutar(
      this.svc.asignar(t.publicId, this.fAsignar)
    );
  }
 
  ejecutarCambiarEstado(): void {
    const t = this.svc.detalle();
    if (!t || !this.fEstado.detalle.trim()) {
      this.errorAccion.set('El detalle es obligatorio.'); return;
    }
    this._ejecutar(
      this.svc.cambiarEstado(t.publicId, this.fEstado)
    );
  }
 
  ejecutarResolver(): void {
    const t = this.svc.detalle();
    if (!t || !this.fResolver.solucionAplicada.trim()) {
      this.errorAccion.set('La solución aplicada es obligatoria.'); return;
    }
    this._ejecutar(
      this.svc.resolver(t.publicId, this.fResolver)
    );
  }
 
  ejecutarCerrar(): void {
    const t = this.svc.detalle();
    if (!t) return;
    this._ejecutar(
      this.svc.cerrar(t.publicId, this.fCerrar)
    );
  }
 
  ejecutarEscalar(): void {
    const t = this.svc.detalle();
    if (!t || !this.fEscalar.tecnicoPublicId || !this.fEscalar.motivo.trim()) {
      this.errorAccion.set('Completa todos los campos.'); return;
    }
    this._ejecutar(
      this.svc.escalar(t.publicId, this.fEscalar)
    );
  }
 
  ejecutarReabrir(): void {
    const t = this.svc.detalle();
    if (!t || !this.fReabrir.motivo.trim()) {
      this.errorAccion.set('El motivo es obligatorio.'); return;
    }
    this._ejecutar(
      this.svc.reabrir(t.publicId, this.fReabrir)
    );
  }
 
  agregarComentario(): void {
    const t = this.svc.detalle();
    if (!t || !this.fComentario.mensaje.trim()) return;
    this.guardandoComentario.set(true);
    this.errorComentario.set(null);
    this.svc.agregarComentario(t.publicId, this.fComentario).subscribe({
      next: (comentario) => {
        this.svc.agregarComentarioLocal(comentario);
        this.fComentario = { mensaje: '', esInterno: false };
        this.guardandoComentario.set(false);
      },
      error: () => {
        this.errorComentario.set('No se pudo enviar el comentario. Intenta nuevamente.');
        this.guardandoComentario.set(false);
      }
    });
  }
 
  private _ejecutar(obs: any): void {
    this.guardando.set(true);
    this.errorAccion.set(null);
    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModal();
        const t = this.svc.detalle();
        if (t) this.svc.cargarDetalle(t.publicId);
      },
      error: () => {
        this.guardando.set(false);
        this.errorAccion.set('Error al ejecutar la acción. Intenta nuevamente.');
      }
    });
  }
 
  // ── Helpers visuales ──────────────────────────────────────────────────────
 
  adjuntoUrl(ruta: string): string {
    return `${environment.api_url}${ruta}`;
  }

formatFecha(f: string | null): string {
    if (!f) return '—';
    return new Date(f).toLocaleString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
  accionesPosibles(): string[] {
    const estado = this.svc.detalle()?.estado ?? '';
    const final  = this.svc.detalle()?.esEstadoFinal ?? false;
    if (final) return ['Reabrir'];
    const map: Record<string, string[]> = {
      'Registrado':     ['Asignar', 'Cambiar Estado'],
      'Asignado':       ['Asignar', 'Cambiar Estado', 'Escalar'],
      'En Diagnóstico': ['Cambiar Estado', 'Resolver', 'Escalar'],
      'En Progreso':    ['Cambiar Estado', 'Resolver', 'Escalar'],
      'Pendiente':      ['Cambiar Estado', 'Escalar'],
      'Resuelto':       ['Cerrar'],
      'Reabierto':      ['Asignar', 'Cambiar Estado'],
    };
    return map[estado] ?? [];
  }
 
  modalIdPorAccion(accion: string): string {
    const map: Record<string, string> = {
      'Asignar': 'modalAsignar', 'Cambiar Estado': 'modalEstado',
      'Resolver': 'modalResolver', 'Cerrar': 'modalCerrar',
      'Escalar': 'modalEscalar', 'Reabrir': 'modalReabrir'
    };
    return map[accion] ?? '';
  }
}