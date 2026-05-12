import { Component, inject, signal, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Sla } from '../../../models/sla.model';
import { SlaService } from '../../../services/sla.service';
import { SlaAddEdit } from '../sla-add-edit/sla-add-edit';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
    selector: 'app-sla-list',
    templateUrl: './sla-list.html',
    imports: [SlaAddEdit, CommonModule]
})
export class SlaList {
    private slaService  = inject(SlaService);
    private toast       = inject(ToastService);

    slas           = resource({ loader: () => firstValueFrom(this.slaService.getAll()) });
    modalAbierto   = signal(false);
    slaSeleccionado = signal<Sla | null>(null);

    openModal(sla: Sla | null) {
        this.slaSeleccionado.set(sla);
        this.modalAbierto.set(true);
    }

    onGuardado(sla: Sla) {
        this.modalAbierto.set(false);
        this.slas.reload();
        this.toast.show('SLA guardado correctamente', 'success');
    }

    eliminar(sla: Sla) {
        if (!confirm(`¿Eliminar el SLA para "${sla.categoriaNombre} - ${sla.prioridadNombre}"?`)) return;
        this.slaService.delete(sla.slaId).subscribe({
            next: () => {
                this.toast.show('SLA eliminado', 'success');
                this.slas.reload();
            },
            error: () => this.toast.show('No se pudo eliminar el SLA', 'error')
        });
    }

    /** Convierte minutos a texto legible: 90 → "1h 30m" */
    formatMin(min: number): string {
        if (!min) return '—';
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h === 0) return `${m}m`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    }
}
