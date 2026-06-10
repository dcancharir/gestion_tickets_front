import { Component, inject, signal, resource, effect } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../../services/user.service";
import { firstValueFrom } from "rxjs";
import { Usuario } from "../../../models/usuario.model";
import { DatePipe } from '@angular/common';
import { UserAddEdit } from "../user-add/user-add-edit";
import { UsuarioSedeAssign } from "../../usuario-sede/usuario-sede-assign/usuario-sede-assign";
import { ToastService } from "../../../../../core/services/toast.service";
import { environment } from "../../../../../../environments/environment";

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

    toastService    = inject(ToastService);
    private userService = inject(UserService);
    private http        = inject(HttpClient);

    usuarios = resource({
        loader: () => firstValueFrom(this.userService.getAll())
    });

    // Modal editar usuario
    modalAbierto        = signal(false);
    usuarioSeleccionado = signal<Usuario | null>(null);

    // Modal asignar sedes
    modalSedesAbierto = signal(false);
    usuarioParaSedes  = signal<Usuario | null>(null);

    // Modal resetear contraseña
    modalResetAbierto    = signal(false);
    usuarioParaReset     = signal<Usuario | null>(null);
    enviandoReset        = signal(false);
    errorReset           = signal<string | null>(null);

    openModal(usuario: Usuario | null) {
        this.usuarioSeleccionado.set(usuario);
        this.modalAbierto.set(true);
    }

    openModalSedes(usuario: Usuario) {
        this.usuarioParaSedes.set(usuario);
        this.modalSedesAbierto.set(true);
    }

    openModalReset(usuario: Usuario) {
        this.usuarioParaReset.set(usuario);
        this.errorReset.set(null);
        this.modalResetAbierto.set(true);
    }

    cerrarModalReset() {
        this.modalResetAbierto.set(false);
        this.usuarioParaReset.set(null);
    }

    confirmarReset() {
        const u = this.usuarioParaReset();
        if (!u) return;
        this.enviandoReset.set(true);
        this.errorReset.set(null);

        this.http.post(
            `${environment.api_url}api/auth/solicitar-recuperacion`,
            { usuarioPublicId: u.publicId }
        ).subscribe({
            next: () => {
                this.enviandoReset.set(false);
                this.cerrarModalReset();
                this.toastService.show(
                    `Correo de recuperación enviado a ${u.email}`, 'success'
                );
            },
            error: (err) => {
                this.enviandoReset.set(false);
                this.errorReset.set(
                    err?.error?.mensaje ?? 'No se pudo enviar el correo. Intenta nuevamente.'
                );
            }
        });
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
