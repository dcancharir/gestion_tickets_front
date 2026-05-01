import { Component, inject,effect } from "@angular/core";
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { RouterOutlet,Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
@Component({
    selector : 'app-layout-base',
    templateUrl : './layout-base.html',
    styleUrl : './layout-base.css',
    imports: [Sidebar, Header, Footer, RouterOutlet]
})
export class LayoutBase {
    authService = inject(AuthService)
    router = inject(Router)
    constructor(){
         effect(() => {
            if(!this.authService.isLogged()){
                this.router.navigate(['/login'])
            }
        });
    }

}