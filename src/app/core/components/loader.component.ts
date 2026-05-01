import { Component,inject } from "@angular/core";
import { LoaderService } from "../services/loader.service";
@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (loader.isLoading()) {
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
      inset: 0;                      /* cubre toda la pantalla */
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;                 /* por encima de modales (z ~1000) */
      pointer-events: all;           /* bloquea todos los clics */
    }

    .loader-card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
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
      color: var(--color-text-secondary);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  loader = inject(LoaderService);
}