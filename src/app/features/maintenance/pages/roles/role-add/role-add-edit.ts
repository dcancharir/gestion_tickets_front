import { Component, Inject, inject, input, linkedSignal, output, signal, resource } from '@angular/core';
import { RolService } from '../../../services/rol.service';
import { Rol } from '../../../models/rol.model';
import { FormsModule } from '@angular/forms';
@Component({
    selector : 'app-role-add-edit',
    templateUrl : './role-add-edit.html',
    imports: [FormsModule]
})
export class RolAddEdit{
   private rolService = inject(RolService);
    // input() / output() reemplazan @Input() / @Output()
    rol = input<Rol|null>(null);
    guardado = output<Rol>();
    cerrado = output();
    guardando = signal(false);
    // linkedSignal: form sincronizado con el input
    form = linkedSignal(()=>({
        rolId : this.rol()?.rolId ?? 0,
        nombre : this.rol()?.nombre ?? '',
        descripcion : this.rol()?.descripcion ?? '',
    }))
    guardar(){
        const u = this.rol()
        const obs = u 
        ? this.rolService.update(u.rolId,this.form())
        : this.rolService.create(this.form());

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