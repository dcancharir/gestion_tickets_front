import { Component, inject, resource } from "@angular/core";
import { PermisoService } from "../../services/permiso.service";
import { firstValueFrom } from "rxjs";
@Component({
    selector : 'app-permisos-add-remove',
    templateUrl : './permisos-add-remove.html',
})
export class PermisosAddRemove{
    permisoService = inject(PermisoService)
    permisos = resource({
        loader : ()=>firstValueFrom(this.permisoService.getAll())
    })

}