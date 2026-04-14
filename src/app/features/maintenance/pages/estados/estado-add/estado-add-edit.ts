import { Component, Inject, inject, input, linkedSignal, output, signal, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from "../../../services/estado.service";
@Component({
    selector : 'app-estado-add-edit',
    templateUrl : './estado-add-edit.html',
    imports : [FormsModule]
})
export class EstadoAddEdit{
    private estadoService = inject(EstadoService);
    // input() / output() reemplazan @Input() / @Output()
    estado = input<Estado|null>(null);
    guardado = output<Estado>();
    cerrado = output();
    guardando = signal(false);
    // linkedSignal: form sincronizado con el input
    form = linkedSignal(()=>({
        estadoId : this.estado()?.estadoId ?? 0,
        nombre : this.estado()?.nombre ?? '',
        descripcion : this.estado()?.descripcion ?? '',
        esEstadoFinal : this.estado()?.esEstadoFinal ?? false,
    }))
    guardar(){
        const u = this.estado()
        const obs = u 
        ? this.estadoService.update(u.estadoId,this.form())
        : this.estadoService.create(this.form());

        this.guardando.set(true);

        obs.subscribe({
            next : (u)=>this.guardado.emit(u),
            error : ()=>this.guardando.set(false)
        });
    }
    closeModal(){
        this.guardando.set(false);
        this.cerrado.emit();
    }
}