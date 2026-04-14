import { Component, Inject, inject, input, linkedSignal, output, signal, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Prioridad } from '../../../models/prioridad.model';
import { PrioridadService } from "../../../services/prioridad.service";
@Component({
    selector : 'app-prioridad-add-edit',
    templateUrl : './prioridad-add-edit.html',
    imports : [FormsModule]
})
export class PrioridadAddEdit{
    private prioridadService = inject(PrioridadService);
    // input() / output() reemplazan @Input() / @Output()
    prioridad = input<Prioridad|null>(null);
    guardado = output<Prioridad>();
    cerrado = output();
    guardando = signal(false);
    // linkedSignal: form sincronizado con el input
    form = linkedSignal(()=>({
        prioridadId : this.prioridad()?.prioridadId ?? 0,
        nombre : this.prioridad()?.nombre ?? '',
        nivel : this.prioridad()?.nivel ?? 0,
        tiempoRespuestaMin : this.prioridad()?.tiempoRespuestaMin ?? 0,
        tiempoResolucionMin : this.prioridad()?.tiempoResolucionMin ?? 0,
    }))
    guardar(){
        const u = this.prioridad()
        const obs = u 
        ? this.prioridadService.update(u.prioridadId,this.form())
        : this.prioridadService.create(this.form());

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