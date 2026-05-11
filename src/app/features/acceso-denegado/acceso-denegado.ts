import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  template: `
    <div class="acceso-denegado-wrapper">
      <div class="acceso-denegado-card">
        <div class="acceso-denegado-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13A6 6 0 1 1 8 2a6 6 0 0 1 0 12z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
        </div>
        <h1 class="acceso-denegado-titulo">Acceso Denegado</h1>
        <p class="acceso-denegado-desc">
          No tienes permiso para acceder a esta vista.<br>
          Contacta con un administrador si crees que esto es un error.
        </p>
        <button class="btn-nuevo" (click)="volver()">Volver al inicio</button>
      </div>
    </div>
  `,
  styles: [`
    .acceso-denegado-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #111;
    }
    .acceso-denegado-card {
      background: #1a1a1a;
      border: 1px solid #2a1a0e;
      border-radius: 12px;
      padding: 3rem 2.5rem;
      text-align: center;
      max-width: 420px;
      width: 100%;
    }
    .acceso-denegado-icon {
      color: #d7691c;
      margin-bottom: 1.5rem;
    }
    .acceso-denegado-titulo {
      font-size: 1.6rem;
      font-weight: 700;
      color: #f5f0eb;
      margin-bottom: 0.75rem;
    }
    .acceso-denegado-desc {
      color: #a09080;
      font-size: 0.92rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
  `]
})
export class AccesoDenegado {
  private router = inject(Router);
  volver() { this.router.navigate(['/principal/mis-tickets']); }
}
