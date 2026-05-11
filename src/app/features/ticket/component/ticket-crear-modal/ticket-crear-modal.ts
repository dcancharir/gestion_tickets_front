import { Component, Output, EventEmitter, inject, signal, resource } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TicketService } from '../../services/ticket.service';
import { TicketListItem } from '../../model/ticket.model';
import { SedeService }   from '../../../maintenance/services/sede.service';

declare var bootstrap: any;

interface PrioridadInfo {
  id:        number;
  nombre:    string;
  colorHexa: string;
}

// Matriz fija: key = `${impacto}-${urgencia}` → prioridad del backend
const MATRIZ_PRIORIDAD: Record<string, PrioridadInfo> = {
  '1-1': { id: 1, nombre: 'Crítico', colorHexa: '#B91C1C' },
  '1-2': { id: 2, nombre: 'Alto',    colorHexa: '#EA580C' },
  '2-1': { id: 3, nombre: 'Alto',    colorHexa: '#EA580C' },
  '1-3': { id: 4, nombre: 'Medio',   colorHexa: '#2563EB' },
  '2-2': { id: 5, nombre: 'Medio',   colorHexa: '#2563EB' },
  '3-1': { id: 6, nombre: 'Medio',   colorHexa: '#2563EB' },
  '2-3': { id: 7, nombre: 'Bajo',    colorHexa: '#15803D' },
  '3-2': { id: 8, nombre: 'Bajo',    colorHexa: '#15803D' },
  '3-3': { id: 9, nombre: 'Bajo',    colorHexa: '#15803D' },
};

@Component({
  selector:    'app-ticket-crear-modal',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './ticket-crear-modal.html',
  styleUrls:   ['./ticket-crear-modal.css']
})
export class TicketCrearModalComponent {

  @Output() ticketCreado = new EventEmitter<TicketListItem>();

  private svc     = inject(TicketService);
  private sedeSvc = inject(SedeService);

  guardando            = signal(false);
  error                = signal<string | null>(null);
  archivosSeleccionados = signal<File[]>([]);

  sedes = resource({
    loader: () => firstValueFrom(this.sedeSvc.getAll())
  });

  categorias = [
    { id: 1, nombre: 'Hardware' }, { id: 2, nombre: 'Software' },
    { id: 3, nombre: 'Red y Conectividad' }, { id: 4, nombre: 'Seguridad' },
    { id: 5, nombre: 'Correo Electrónico' }, { id: 6, nombre: 'Base de Datos' },
    { id: 7, nombre: 'Accesos y Permisos' }, { id: 8, nombre: 'Otros' }
  ];

  canales = ['Web', 'Teléfono', 'Email', 'Presencial', 'Chat'];

  form = this._formVacio();

  private _formVacio() {
    return {
      titulo: '', descripcion: '', categoriaId: 0,
      canalReporte: 'Web', impacto: 2, urgencia: 2, sedeId: 0
    };
  }

  get prioridad(): PrioridadInfo {
    return MATRIZ_PRIORIDAD[`${this.form.impacto}-${this.form.urgencia}`]
      ?? { id: 5, nombre: 'Medio', colorHexa: '#2563EB' };
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const nuevos = Array.from(input.files);
      this.archivosSeleccionados.update(prev => [...prev, ...nuevos]);
    }
    input.value = '';
  }

  removerArchivo(index: number): void {
    this.archivosSeleccionados.update(prev => prev.filter((_, i) => i !== index));
  }

  guardar(): void {
    if (!this.form.titulo.trim() || !this.form.descripcion.trim() || !this.form.categoriaId) {
      this.error.set('Completa los campos obligatorios.');
      return;
    }
    if (!this.form.sedeId) {
      this.error.set('Selecciona una sede.');
      return;
    }

    const fd = new FormData();
    fd.append('titulo',       this.form.titulo);
    fd.append('descripcion',  this.form.descripcion);
    fd.append('categoriaId',  String(this.form.categoriaId));
    fd.append('canalReporte', this.form.canalReporte);
    fd.append('impacto',      String(this.form.impacto));
    fd.append('urgencia',     String(this.form.urgencia));
    fd.append('prioridadId',  String(this.prioridad.id));
    fd.append('sedeId',       String(this.form.sedeId));
    this.archivosSeleccionados().forEach(f => fd.append('adjuntos', f, f.name));

    this.guardando.set(true);
    this.error.set(null);

    this.svc.crear(fd).subscribe({
      next: (ticket) => {
        this.guardando.set(false);
        this.ticketCreado.emit(ticket);
        this._reset();
        const el = document.getElementById('modalCrearTicket');
        if (el) bootstrap.Modal.getInstance(el)?.hide();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al crear el ticket. Intenta nuevamente.');
      }
    });
  }

  cancelar(): void {
    this._reset();
  }

  private _reset(): void {
    this.form = this._formVacio();
    this.archivosSeleccionados.set([]);
    this.error.set(null);
  }
}
