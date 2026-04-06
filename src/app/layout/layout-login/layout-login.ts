import { Component } from "@angular/core";
import { Login } from "../../features/auth/pages/login/login";
@Component({
    selector : 'app-layout-login',
    templateUrl : './layout-login.html',
    imports: [Login]
})
export class LayoutLogin{

}