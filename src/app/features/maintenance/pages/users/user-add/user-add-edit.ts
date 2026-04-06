import { Component, Inject, inject, input, linkedSignal, output, signal, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Usuario } from '../../../models/usuario.model';
import { RolService } from "../../../services/rol.service";
import { firstValueFrom } from "rxjs";
@Component({
    selector : 'app-user-add-edit',
    templateUrl : './user-add-edit.html',
    imports : [FormsModule]
})
export class UserAddEdit{
    private usuarioService = inject(UserService);
    // input() / output() reemplazan @Input() / @Output()
    usuario = input<Usuario|null>(null);
    guardado = output<Usuario>();
    cerrado = output();
    guardando = signal(false);
    // linkedSignal: form sincronizado con el input
    form = linkedSignal(()=>({
        publicId : this.usuario()?.publicId ?? '',
        nombre : this.usuario()?.nombre ?? '',
        email : this.usuario()?.email ?? '',
        apellidos : this.usuario()?.apellidos ?? '',
        userName : this.usuario()?.userName ?? '',
        activo : this.usuario()?.activo ?? true,
        rolId : this.usuario()?.rolId ?? 0
    }))
    private rolService = inject(RolService)

    roles = resource({
        loader:()=>firstValueFrom(this.rolService.getAll())
    })
    guardar(){
        const u = this.usuario()
        const obs = u 
        ? this.usuarioService.update(u.publicId,this.form())
        : this.usuarioService.create(this.form());

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