import { Component,inject } from "@angular/core";
import { ToastService } from "../services/toast.service";
@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (t of toast.toasts(); track t.id) {
        <div class="d-flex toast" [class]="t.type">
            <div class="toast-body">
                {{t.message}}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="toast.dismiss(t.id)"></button>
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
    .toast { align-items: center; gap: 10px;
             padding: 10px 0px 10px 14px; border-radius: 8px; font-size: 13px; }
    .toast.success { color: #EAF3DE; background-color: #219653; }
    .toast.error   { color: #FCEBEB; background-color: #d50100; }
    .toast.info    { color: #E6F1FB; background-color: #0ba5ec; }
  `]
})
export class ToastComponent {
  toast = inject(ToastService);
}