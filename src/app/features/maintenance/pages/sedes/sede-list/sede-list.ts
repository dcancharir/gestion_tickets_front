import { Component,inject,signal,resource } from "@angular/core";
import { SedeService } from "../../../services/sede.service";
import { firstValueFrom } from "rxjs";
import { Sede } from "../../../models/sede.model";
import { SedeAddEdit } from "../sede-add/sede-add-edit";
@Component({
    selector : 'app-sede-list',
    templateUrl : './sede-list.html',
    imports : [SedeAddEdit]
})
export class SedeList{
    private sedeService = inject(SedeService);
    sedes = resource({
        loader : ()=>firstValueFrom(this.sedeService.getAll())
    })
    modalAbierto = signal(false)
    sedeSeleccionada = signal<Sede|null>(null)
    openModal(sede:Sede | null){
        this.sedeSeleccionada.set(sede);
        this.modalAbierto.set(true);
        console.log(this.modalAbierto())
    }
    onGuardado(sede : Sede){
        this.modalAbierto.set(false);
        this.sedes.reload();
    }
    eliminar(id:number){
        console.log(id)
    }
}