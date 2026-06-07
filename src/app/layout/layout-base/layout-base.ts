import { Component, inject, effect } from "@angular/core";
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";
import { RouterOutlet, Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { LayoutService } from "../../core/services/layout.service";

@Component({
  selector: 'app-layout-base',
  templateUrl: './layout-base.html',
  styleUrl: './layout-base.css',
  imports: [Sidebar, Header, RouterOutlet]
})
export class LayoutBase {
  authService = inject(AuthService);
  router      = inject(Router);
  layoutSvc   = inject(LayoutService);

  constructor() {
    this.layoutSvc.init();
    effect(() => {
      if (!this.authService.isLogged()) {
        this.router.navigate(['/login']);
      }
    });
  }
}