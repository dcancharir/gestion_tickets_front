import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

type EstadoPagina = 'validando' | 'formulario' | 'token-invalido' | 'exito';

@Component({
  selector: 'app-restablecer-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './restablecer-password.html',
  styleUrl: './restablecer-password.css',
})
export class RestablecerPasswordComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private http   = inject(HttpClient);

  estado        = signal<EstadoPagina>('validando');
  nombreUsuario = signal<string | null>(null);
  token         = '';

  // Formulario
  nuevaPassword    = '';
  confirmarPassword = '';
  mostrarPassword  = signal(false);
  guardando        = signal(false);
  error            = signal<string | null>(null);

  readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.estado.set('token-invalido');
      return;
    }

    // Validar token en el backend
    this.http.get<{ valido: boolean; nombreUsuario: string | null }>(
      `${environment.api_url}api/auth/validar-token/${this.token}`
    ).subscribe({
      next: res => {
        if (res.valido) {
          this.nombreUsuario.set(res.nombreUsuario);
          this.estado.set('formulario');
        } else {
          this.estado.set('token-invalido');
        }
      },
      error: () => this.estado.set('token-invalido')
    });
  }

  toggleMostrar(): void {
    this.mostrarPassword.update(v => !v);
  }

  guardar(): void {
    this.error.set(null);

    if (this.nuevaPassword.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    this.guardando.set(true);
    this.http.post(
      `${environment.api_url}api/auth/restablecer-password`,
      {
        token:            this.token,
        nuevoPassword:    this.nuevaPassword,
        confirmarPassword: this.confirmarPassword,
      }
    ).subscribe({
      next:  () => { this.guardando.set(false); this.estado.set('exito'); },
      error: err => {
        this.guardando.set(false);
        this.error.set(
          err?.error?.mensaje ?? 'No se pudo restablecer la contraseña. Intenta nuevamente.'
        );
      }
    });
  }

  irLogin(): void {
    this.router.navigate(['/login']);
  }
}
