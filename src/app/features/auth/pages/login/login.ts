import { Component, effect, inject, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../../../core/services/auth.service";
import { SignalrService } from "../../../../core/services/signalr.service";
import { Router } from "@angular/router";
import { ToastService } from "../../../../core/services/toast.service";
@Component({
    selector : 'app-login',
    templateUrl : './login.html',
    styleUrl: './login.css',
    imports: [FormsModule]
})
export class Login {
    constructor() {
        effect(()=>{
            if(this.authService.isLogged()){
                const rol = this.authService.getUserInfo()?.rol;
                const destino = rol === 'Solicitante' ? '/principal/mis-tickets' : '/dashboard';
                this.router.navigate([destino]);
            }
        })
    }
    toastService  = inject(ToastService);
    authService   = inject(AuthService);
    signalrSvc    = inject(SignalrService);
    router        = inject(Router);
    userName = signal('');
    password = signal('');
    showPassword = signal(false);
    readonly currentYear = new Date().getFullYear();
    togglePassword() {
        this.showPassword.update(value => !value);
    }
    login(){
        this.authService.login(
            {
                userName : this.userName(),
                password : this.password()
            }).subscribe({
            next : (response) =>{
                if(response){
                    this.signalrSvc.connect();
                    this.toastService.show(`Bienvenido al sistema ${response.userName}`)
                    const destino = response.rol === 'Solicitante' ? '/principal/mis-tickets' : '/dashboard';
                    setTimeout(() => {
                        this.router.navigate([destino]);
                    }, 1500);
                }
                else{
                    this.toastService.show('Ha ocurrido un error')
                }
            },
            error : (error) =>{
                const result = error.error
                this.toastService.show(result.mensaje,'error')
            },
            complete : ()=>{
            }
        })
    }
}