import { Component, computed, inject, resource, signal } from "@angular/core";
import { PermisoService } from "../../services/permiso.service";
import { catchError, firstValueFrom, of, switchMap } from "rxjs";
import { Permiso } from "../../models/permiso.model";
import { RolService } from "../../services/rol.service";
import { PermisoRolService } from "../../services/permiso-rol.service";
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ToastService } from "../../../../core/services/toast.service";
@Component({
    selector : 'app-permisos-add-remove',
    templateUrl : './permisos-add-remove.html',
    imports : [FormsModule]
})
export class PermisosAddRemove{
    toastService = inject(ToastService)
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
    async addDeletePermission(event: Event, permisoId: number) {
        const checkbox = event.target as HTMLInputElement;
        const rolId = this.selectedRolId();

        if (rolId === null) {
            checkbox.checked = !checkbox.checked;
            this.toastService.show('Seleccione un Rol', 'error')
            return;
        }

        if (checkbox.checked) {
            const res = await firstValueFrom(
                this.permisoRolService.create(permisoId, rolId)
            )
            console.log(res)
        }
         else {
            const res = await firstValueFrom(
                this.permisoRolService.delete(permisoId, rolId)
            );
            console.log(res)
        }
    }
    onRolChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.selectedRolId.set(value ? Number(value) : null);
    }
    // signal para el rol seleccionado
    selectedRolId = signal<number | null>(null);

    // convertimos a observable
    rolId$ = toObservable(this.selectedRolId);

    // permisos como signal reactivo
    permisosRol = toSignal(
        this.rolId$.pipe(
            switchMap(rolId => {
            if (!rolId) return of([]);
            return this.permisoRolService.getByRol(rolId).pipe(
                catchError(err => {
                console.error(err);
                return of([]);
                })
            );
            })
        ),
        { initialValue: [] }
    );
    tienePermiso(permisoId: number): boolean {
        return this.permisosRol().some(pr => pr.permisoId === permisoId);
    }
}