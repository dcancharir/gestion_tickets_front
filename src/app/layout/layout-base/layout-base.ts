import { Component } from "@angular/core";
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { RouterOutlet } from "@angular/router";
@Component({
    selector : 'app-layout-base',
    templateUrl : './layout-base.html',
    styleUrl : './layout-base.css',
    imports: [Sidebar, Header, Footer, RouterOutlet]
})
export class LayoutBase {

}