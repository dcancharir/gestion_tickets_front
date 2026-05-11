import { Component, inject, input, OnInit, output, resource, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { SedeService } from "../../../services/sede.service";
import { UsuarioSedeService } from "../../../services/usuario-sede.service";
import { Usuario } from "../../../models/usuario.model";
import { Sede } from "../../../models/sede.model";
import { ToastService } from "../../../../../core/services/toast.service";

@Component({
    selector: 'app-usuario-sede-assign',
    templateUrl: './usuario-sede-assign.html',
    imports: [FormsModule]
})
export class UsuarioSedeAssign implements OnInit {
    private sedeService = inject(SedeService);
    private usuarioSedeService = inject(UsuarioSedeService);
    private toastService = inject(ToastService);

    usuario = input.required<Usuario>();
    guardado = output();
    cerrado = output();

    guardando = signal(false);
    cargandoSedes = signal(true);

    todasSedes = resource({
        loader: () => firstValueFrom(this.sedeService.getAll())
    });

    selectedSedeIds = signal<number[]>([]);

    ngOnInit(): void {
        firstValueFrom(this.usuarioSedeService.getSedes(this.usuario().publicId))
            .then((sedes: Sede[]) => {
                this.selectedSedeIds.set(sedes.map(s => s.sedeId));
                this.cargandoSedes.set(false);
            })
            .catch(() => this.cargandoSedes.set(false));
    }

    estaSeleccionada(sedeId: number): boolean {
        return this.selectedSedeIds().includes(sedeId);
    }

    toggleSede(sedeId: number, checked: boolean): void {
        if (checked) {
            this.selectedSedeIds.update(ids => [...ids, sedeId]);
        } else {
            this.selectedSedeIds.update(ids => ids.filter(id => id !== sedeId));
        }
    }

    async guardar(): Promise<void> {
        this.guardando.set(true);
        try {
            await firstValueFrom(
                this.usuarioSedeService.asignarSedes(this.usuario().publicId, this.selectedSedeIds())
            );
            this.toastService.show('Sedes asignadas correctamente', 'success');
            this.guardado.emit();
        } catch {
            this.toastService.show('Error al asignar sedes', 'error');
            this.guardando.set(false);
        }
    }

    closeModal(): void {
        this.cerrado.emit();
    }
}
