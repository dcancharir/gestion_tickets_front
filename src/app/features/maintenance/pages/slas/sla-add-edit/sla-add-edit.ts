import { Component, inject, input, linkedSignal, output, signal, resource } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Sla } from '../../../models/sla.model';
import { SlaService } from '../../../services/sla.service';
import { CategoriaService } from '../../../services/categoria.service';
import { PrioridadService } from '../../../services/prioridad.service';

@Component({
    selector: 'app-sla-add-edit',
    templateUrl: './sla-add-edit.html',
    imports: [FormsModule, DecimalPipe]
})
export class SlaAddEdit {
    private slaService       = inject(SlaService);
    private categoriaService = inject(CategoriaService);
    private prioridadService = inject(PrioridadService);

    sla      = input<Sla | null>(null);
    guardado = output<Sla>();
    cerrado  = output();

    guardando = signal(false);
    error     = signal<string | null>(null);

    categorias  = resource({ loader: () => firstValueFrom(this.categoriaService.getAll()) });
    prioridades = resource({ loader: () => firstValueFrom(this.prioridadService.getAll()) });

    form = linkedSignal(() => ({
        categoriaId:         this.sla()?.categoriaId        ?? 0,
        prioridadId:         this.sla()?.prioridadId        ?? 0,
        tiempoRespuestaMin:  this.sla()?.tiempoRespuestaMin ?? 0,
        tiempoResolucionMin: this.sla()?.tiempoResolucionMin ?? 0,
        activo:              this.sla()?.activo              ?? true,
    }));

    guardar() {
        this.error.set(null);
        const f = this.form();

        if (!f.categoriaId || !f.prioridadId) {
            this.error.set('Categoría y Prioridad son obligatorios.');
            return;
        }
        if (f.tiempoRespuestaMin <= 0 || f.tiempoResolucionMin <= 0) {
            this.error.set('Los tiempos deben ser mayores a 0.');
            return;
        }
        if (f.tiempoResolucionMin <= f.tiempoRespuestaMin) {
            this.error.set('El tiempo de resolución debe ser mayor al de respuesta.');
            return;
        }

        this.guardando.set(true);
        const s = this.sla();
        const obs = s
            ? this.slaService.update(s.slaId, f)
            : this.slaService.create(f);

        obs.subscribe({
            next:  (result) => this.guardado.emit(result),
            error: ()       => {
                this.error.set('Ya existe un SLA para esa combinación de Categoría y Prioridad.');
                this.guardando.set(false);
            }
        });
    }

    closeModal() {
        this.guardando.set(false);
        this.cerrado.emit();
    }
}
