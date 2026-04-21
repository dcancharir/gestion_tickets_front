import { Component, computed, inject, resource } from "@angular/core";
import { PermisoService } from "../../services/permiso.service";
import { firstValueFrom } from "rxjs";
import { Permiso } from "../../models/permiso.model";
import { RolService } from "../../services/rol.service";
import { PermisoRolService } from "../../services/permiso-rol.service";
import { FormsModule } from '@angular/forms';
@Component({
    selector : 'app-permisos-add-remove',
    templateUrl : './permisos-add-remove.html',
    imports : [FormsModule]
})
export class PermisosAddRemove{
    selectedRolId : number | null = null;
    permisoService = inject(PermisoService)
    rolService = inject(RolService)
    permisoRolService = inject(PermisoRolService)
    permisos = resource({
        loader : ()=>firstValueFrom(this.permisoService.getAll())
    })
    roles = resource({
        loader : ()=>firstValueFrom(this.rolService.getAll())
    })
    
   agrupadosArray = computed(() => {
    const data = this.permisos.value();
    if (!data) return [];

    const grouped = data.reduce((acc, permiso) => {
        
        if(permiso.controlador.endsWith('Controller')) {
            permiso.controlador = permiso.controlador.replace('Controller', ''); // Eliminar 'Controller' del final
        }
        const key = permiso.controlador;
        if (!acc[key]) acc[key] = [];
        acc[key].push(permiso);
        return acc;
        }, {} as Record<string, Permiso[]>);
        return Object.entries(grouped).map(([controlador, permisos]) => ({
            controlador,
            permisos
        }));
    });
    getPermissions(){
        console.log(this.selectedRolId);
        // if(this.selectedRolId){
        //     this.permisoRolService.getByRol(this.selectedRolId).subscribe(permisos=>{
        //         console.log(permisos);
        //     })
        // }       
    }
}