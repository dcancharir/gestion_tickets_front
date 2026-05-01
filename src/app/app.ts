import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './core/components/toast.component';
import { LoaderComponent } from './core/components/loader.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastComponent,LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion_tickets_front');
}
