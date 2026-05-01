import { Component, effect, inject, signal } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../../../core/services/auth.service";
import { Router } from "@angular/router";
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
                    
                    this.router.navigate(['/dashboard'])
                }
            },
            error : (error) =>{},
            complete : ()=>{
            }
        })
    }
}