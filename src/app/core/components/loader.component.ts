import { Component, inject, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { LoaderService } from "../services/loader.service";

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (mostrar()) {
      <div class="loader-overlay">
        <div class="loader-card">
          <div class="spinner"></div>
          <span>Cargando...</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      pointer-events: all;
    }

    .loader-card {
      background: #ffffff;
      border: 1px solid #E8E3DC;
      border-radius: 16px;
      padding: 1.75rem 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #B5D4F4;
      border-top-color: #185FA5;
      border-radius: 50%;
      animation: spin .8s linear infinite;
    }

    span {
      font-size: 13px;
      color: #8A827A;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  loader = inject(LoaderService);
  router = inject(Router);

  /** true cuando la URL actual es la página de login */
  private esLogin = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.isLoginUrl()),
      startWith(this.isLoginUrl())
    ),
    { initialValue: this.isLoginUrl() }
  );

  /** Mostrar overlay sólo si hay request activa Y no estamos en login */
  mostrar = computed(() => this.loader.isLoading() && !this.esLogin());

  private isLoginUrl(): boolean {
    const url = this.router.url;
    return url === '/login' || url === '/' || url === '';
  }
}
