import { Component,inject,signal,resource } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { RolService } from "../../../services/rol.service";
import { Rol } from "../../../models/rol.model";
import { RolAddEdit } from "../role-add/role-add-edit";
@Component({
    selector : 'app-role-list',
    templateUrl : './role-list.html',
    imports : [RolAddEdit]
})
export class RoleList{
    private rolService = inject(RolService);
    roles = resource({
        loader : ()=>firstValueFrom(this.rolService.getAll())
    })
    modalAbierto = signal(false)
    rolSeleccionado = signal<Rol|null>(null)
    openModal(rol:Rol | null){
        this.rolSeleccionado.set(rol);
        this.modalAbierto.set(true);
        console.log(this.modalAbierto())
    }   
    onGuardado(rol : Rol){
        this.modalAbierto.set(false);
        this.roles.reload();
    }
    eliminar(id:number){
        console.log(id)
    }
}