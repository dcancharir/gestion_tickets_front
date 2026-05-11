import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService }  from '../../services/ticket.service';
 
declare var bootstrap: any;
 
@Component({
  selector:    'app-ticket-detalle',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './ticket-detalle.html',
  styleUrls:   ['./ticket-detalle.css']
})
export class TicketDetalleComponent implements OnInit {
 
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  readonly svc   = inject(TicketService);
 
  // ── Estado de los modales ──────────────────────────────────────────────────
  accionActiva = signal<string>('');
  guardando    = signal(false);
  errorAccion  = signal<string | null>(null);
 
  // ── Formularios de modales ─────────────────────────────────────────────────
  fAsignar   = { tecnicoPublicId: '' };
  fEstado    = { nuevoEstadoId: 3, detalle: '' };
  fResolver  = { solucionAplicada: '', resueltoEnPrimerContacto: false };
  fCerrar    = { comentario: '' };
  fEscalar   = { tecnicoPublicId: '', motivo: '' };
  fReabrir   = { motivo: '' };
  fComentario = { mensaje: '', esInterno: false };
 
  // Catálogos (en producción vienen de CatalogoService)
  estados = [
    { id: 3, nombre: 'En Diagnóstico' },
    { id: 4, nombre: 'En Progreso' },
    { id: 5, nombre: 'Pendiente' },
  ];
 
  // Técnicos disponibles (en producción vienen de UsuarioService)
  tecnicos: { publicId: string; nombre: string }[] = [];
 
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
    this.guardando.set(true);
    this.svc.agregarComentario(t.publicId, this.fComentario).subscribe({
      next: () => {
        this.fComentario = { mensaje: '', esInterno: false };
        this.guardando.set(false);
        this.svc.cargarDetalle(t.publicId); // refrescar historial
      },
      error: () => { this.guardando.set(false); }
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
 
  formatFecha(f: string | null): string {
    if (!f) return '—';
    return new Date(f).toLocaleString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
 
  prioridadClass(nivel: number): string {
    return ['','badge-critico','badge-alto','badge-medio','badge-bajo','badge-planificado'][nivel] ?? '';
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