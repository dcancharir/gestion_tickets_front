import { Component,inject,signal,resource } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { firstValueFrom } from "rxjs";
import { Usuario } from "../../../models/usuario.model";
import { DatePipe } from '@angular/common';
import { UserAddEdit } from "../user-add/user-add-edit";
@Component({
    selector : 'app-user-list',
    templateUrl : './user-list.html',
    imports: [DatePipe, UserAddEdit]
})
export class UserList{
    private userService = inject(UserService);
    usuarios = resource({
        loader : ()=>firstValueFrom(this.userService.getAll())
    })
    modalAbierto = signal(false)
    usuarioSeleccionado = signal<Usuario|null>(null)
    openModal(usuario:Usuario | null){
        this.usuarioSeleccionado.set(usuario);
        this.modalAbierto.set(true);
        console.log(this.modalAbierto())
    }
    onGuardado(usuario : Usuario){
        this.modalAbierto.set(false);
        this.usuarios.reload();
    }
    eliminar(id:string){
        console.log(id)
    }
}