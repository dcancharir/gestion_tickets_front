import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { TicketListItem, CrearTicketRequest } from '../../model/ticket.model';
 
declare var bootstrap: any; // Bootstrap JS global
 
@Component({
  selector:    'app-ticket-crear-modal',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './ticket-crear-modal.html',
  styleUrls:   ['./ticket-crear-modal.css']
})
export class TicketCrearModalComponent {
 
  @Output() ticketCreado = new EventEmitter<TicketListItem>();
 
  private svc = inject(TicketService);
 
  guardando = signal(false);
  error     = signal<string | null>(null);
 
  // Catálogos — en producción vendrían de CatalogoService
  categorias  = [
    { id: 1, nombre: 'Hardware' }, { id: 2, nombre: 'Software' },
    { id: 3, nombre: 'Red y Conectividad' }, { id: 4, nombre: 'Seguridad' },
    { id: 5, nombre: 'Correo Electrónico' }, { id: 6, nombre: 'Base de Datos' },
    { id: 7, nombre: 'Accesos y Permisos' }, { id: 8, nombre: 'Otros' }
  ];
 
  prioridades = [
    { id: 1, nombre: 'Crítico' }, { id: 2, nombre: 'Alto' },
    { id: 3, nombre: 'Medio' },   { id: 4, nombre: 'Bajo' },
    { id: 5, nombre: 'Planificado' }
  ];
 
  canales = ['Web', 'Teléfono', 'Email', 'Presencial', 'Chat'];
 
  form: CrearTicketRequest = this._formVacio();
 
  private _formVacio(): CrearTicketRequest {
    return {
      titulo: '', descripcion: '', categoriaId: 0,
      canalReporte: 'Web', impacto: 2, urgencia: 2, prioridadId: 3
    };
  }
 
  guardar(): void {
    if (!this.form.titulo.trim() || !this.form.descripcion.trim() || !this.form.categoriaId) {
      this.error.set('Completa los campos obligatorios.');
      return;
    }
 
    this.guardando.set(true);
    this.error.set(null);
 
    this.svc.crear(this.form).subscribe({
      next: (ticket) => {
        this.guardando.set(false);
        this.ticketCreado.emit(ticket);
        this.form = this._formVacio();
        // Cerrar modal Bootstrap
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
    this.form  = this._formVacio();
    this.error.set(null);
  }
}