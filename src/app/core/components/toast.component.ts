import { Component,inject } from "@angular/core";
import { ToastService } from "../services/toast.service";
@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="t.type">
            <div class="toast-body">{{t.message}}</div>
            <button type="button" class="toast-close" (click)="toast.dismiss(t.id)" aria-label="Cerrar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem; right: 1rem;
      z-index: 1000;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 8px 10px 14px; border-radius: 8px;
      font-size: 13px; margin-bottom: 8px;
      min-width: 260px; max-width: 380px;
      box-shadow: 0 4px 14px rgba(0,0,0,.18);
    }
    .toast-body { flex: 1; }
    .toast-close {
      background: none; border: none; cursor: pointer;
      color: inherit; opacity: .75; padding: 4px;
      border-radius: 5px; flex-shrink: 0;
      display: grid; place-items: center;
      transition: opacity .15s;
    }
    .toast-close:hover { opacity: 1; }
    .toast.success { color: #EAF3DE; background-color: #219653; }
    .toast.error   { color: #FCEBEB; background-color: #d50100; }
    .toast.info    { color: #E6F1FB; background-color: #0ba5ec; }
  `]
})
export class ToastComponent {
  toast = inject(ToastService);
}