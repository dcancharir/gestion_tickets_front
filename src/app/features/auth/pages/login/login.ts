import { Component, effect, inject, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";
import { ToastService } from "../../../../core/services/toast.service";
@Component({
    selector : 'app-login',
    templateUrl : './login.html',
    imports: [FormsModule]
})
export class Login {
    constructor() {
        effect(()=>{
            if(this.authService.isLogged()){
                this.router.navigate(['/dashboard'])
            } 
        })
    }
    toastService = inject(ToastService)
    authService = inject(AuthService)
    router = inject(Router)
    userName = signal('')
    password = signal('')
    showPassword = signal(false);
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
                    this.toastService.show(`Bienvenido al sistema ${response.userName}`)
                    setTimeout(() => {
                        this.router.navigate(['/dashboard'])
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