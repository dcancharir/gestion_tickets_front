import { Component,inject } from "@angular/core";
import { ToastService } from "../services/toast.service";
@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="t.type">
          <span class="toast-icon">
            @if (t.type === 'success') { ✓ }
            @else if (t.type === 'error') { ✕ }
            @else { i }
          </span>
          {{ t.message }}
          <button (click)="toast.dismiss(t.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem; right: 1rem;
      display: flex; flex-direction: column; gap: 8px;
      z-index: 1000;
    }
    .toast { display: flex; align-items: center; gap: 10px;
             padding: 10px 14px; border-radius: 8px; font-size: 13px; }
    .toast.success { background: #EAF3DE; color: #27500A; }
    .toast.error   { background: #FCEBEB; color: #791F1F; }
    .toast.info    { background: #E6F1FB; color: #0C447C; }
  `]
})
export class ToastComponent {
  toast = inject(ToastService);
}