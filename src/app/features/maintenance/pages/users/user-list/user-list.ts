import { Component, inject, signal, resource, effect } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { firstValueFrom } from "rxjs";
import { Usuario } from "../../../models/usuario.model";
import { DatePipe } from '@angular/common';
import { UserAddEdit } from "../user-add/user-add-edit";
import { UsuarioSedeAssign } from "../../usuario-sede/usuario-sede-assign/usuario-sede-assign";
import { ToastService } from "../../../../../core/services/toast.service";

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.html',
    imports: [DatePipe, UserAddEdit, UsuarioSedeAssign]
})
export class UserList {
    constructor() {
        effect(() => {
            if (this.usuarios.status() == 'resolved') {
                this.toastService.show('Usuarios cargados correctamente', 'success');
            }
        });
    }
    toastService = inject(ToastService);
    private userService = inject(UserService);

    usuarios = resource({
        loader: () => firstValueFrom(this.userService.getAll())
    });

    // Modal editar usuario
    modalAbierto = signal(false);
    usuarioSeleccionado = signal<Usuario | null>(null);

    // Modal asignar sedes
    modalSedesAbierto = signal(false);
    usuarioParaSedes = signal<Usuario | null>(null);

    openModal(usuario: Usuario | null) {
        this.usuarioSeleccionado.set(usuario);
        this.modalAbierto.set(true);
    }

    openModalSedes(usuario: Usuario) {
        this.usuarioParaSedes.set(usuario);
        this.modalSedesAbierto.set(true);
    }

    onGuardado(usuario: Usuario) {
        this.modalAbierto.set(false);
        this.usuarios.reload();
    }

    onSedesGuardadas() {
        this.modalSedesAbierto.set(false);
    }

    eliminar(id: string) {}
}