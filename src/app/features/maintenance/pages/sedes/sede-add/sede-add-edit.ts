import { Component, Inject, inject, input, linkedSignal, output, signal, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sede } from '../../../models/sede.model';
import { SedeService } from "../../../services/sede.service";
@Component({
    selector : 'app-sede-add-edit',
    templateUrl : './sede-add-edit.html',
    imports : [FormsModule]
})
export class SedeAddEdit{
    private sedeService = inject(SedeService);
    // input() / output() reemplazan @Input() / @Output()
    sede = input<Sede|null>(null);
    guardado = output<Sede>();
    cerrado = output();
    guardando = signal(false);
    // linkedSignal: form sincronizado con el input
    form = linkedSignal(()=>({
        sedeId : this.sede()?.sedeId ?? 0,
        sedeIdExterno : this.sede()?.sedeIdExterno ?? 0,
        nombre : this.sede()?.nombre ?? '',
        tipoSede : this.sede()?.tipoSede ?? '',
    }))
    guardar(){
        const u = this.sede()
        const obs = u 
        ? this.sedeService.update(u.sedeId,this.form())
        : this.sedeService.create(this.form());

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