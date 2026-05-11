import { Component, OnInit, inject, signal, resource, effect } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom }  from 'rxjs';
import { TicketService }   from '../../services/ticket.service';
import { EstadoService }   from '../../../maintenance/services/estado.service';
import { PrioridadService } from '../../../maintenance/services/prioridad.service';
import { UserService }     from '../../../maintenance/services/user.service';
import { environment }     from '../../../../../environments/environment';
 
declare var bootstrap: any;
 
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
  readonly svc         = inject(TicketService);
  private estadoSvc    = inject(EstadoService);
  private prioridadSvc = inject(PrioridadService);
  private userSvc      = inject(UserService);

  estados     = resource({ loader: () => firstValueFrom(this.estadoSvc.getAll()) });
  prioridades = resource({ loader: () => firstValueFrom(this.prioridadSvc.getAll()) });

  estadoColor(nombre: string): string {
    return (this.estados.value() ?? []).find(e => e.nombre === nombre)?.colorHexa ?? '#7a6a5a';
  }

  prioridadColor(nombre: string): string {
    return (this.prioridades.value() ?? []).find(p => p.nombre === nombre)?.colorHexa ?? '#7a6a5a';
  }
 
  // ── Estado de los modales ──────────────────────────────────────────────────
  accionActiva       = signal<string>('');
  guardando          = signal(false);
  errorAccion        = signal<string | null>(null);

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
  }
 
  volver(): void {
    this.router.navigate(['/tickets']);
  }
 
  // ── Acciones ───────────────────────────────────────────────────────────────
 
  ejecutarAsignar(): void {
    const t = this.svc.detalle();
    if (!t || !this.fAsignar.tecnicoPublicId) return;
    this._ejecutar(
      this.svc.asignar(t.publicId, this.fAsignar),
      'modalAsignar'
    );
  }
 
  ejecutarCambiarEstado(): void {
    const t = this.svc.detalle();
    if (!t || !this.fEstado.detalle.trim()) {
      this.errorAccion.set('El detalle es obligatorio.'); return;
    }
    this._ejecutar(
      this.svc.cambiarEstado(t.publicId, this.fEstado),
      'modalEstado'
    );
  }
 
  ejecutarResolver(): void {
    const t = this.svc.detalle();
    if (!t || !this.fResolver.solucionAplicada.trim()) {
      this.errorAccion.set('La solución aplicada es obligatoria.'); return;
    }
    this._ejecutar(
      this.svc.resolver(t.publicId, this.fResolver),
      'modalResolver'
    );
  }
 
  ejecutarCerrar(): void {
    const t = this.svc.detalle();
    if (!t) return;
    this._ejecutar(
      this.svc.cerrar(t.publicId, this.fCerrar),
      'modalCerrar'
    );
  }
 
  ejecutarEscalar(): void {
    const t = this.svc.detalle();
    if (!t || !this.fEscalar.tecnicoPublicId || !this.fEscalar.motivo.trim()) {
      this.errorAccion.set('Completa todos los campos.'); return;
    }
    this._ejecutar(
      this.svc.escalar(t.publicId, this.fEscalar),
      'modalEscalar'
    );
  }
 
  ejecutarReabrir(): void {
    const t = this.svc.detalle();
    if (!t || !this.fReabrir.motivo.trim()) {
      this.errorAccion.set('El motivo es obligatorio.'); return;
    }
    this._ejecutar(
      this.svc.reabrir(t.publicId, this.fReabrir),
      'modalReabrir'
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
 
  private _ejecutar(obs: any, modalId: string): void {
    this.guardando.set(true);
    this.errorAccion.set(null);
    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        const el = document.getElementById(modalId);
        if (el) bootstrap.Modal.getInstance(el)?.hide();
        // Recargar el detalle para reflejar cambios
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