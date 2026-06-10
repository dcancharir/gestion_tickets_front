import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

interface UsuarioDto {
  publicId: string;
  nombre: string;
  apellidos: string;
  email: string;
  rolNombre: string;
  activo: boolean;
  fechaCreacion: string;
  userName: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent {
  private http    = inject(HttpClient);
  private auth    = inject(AuthService);
  private toast   = inject(ToastService);

  usuario   = signal<UsuarioDto | null>(null);
  cargando  = signal(true);
  guardando = signal(false);
  error     = signal<string | null>(null);
  editando  = signal(false);

  // Campos del formulario
  fNombre    = '';
  fApellidos = '';
  fEmail     = '';

  avatarInitial = computed(() => {
    const u = this.usuario();
    return u?.nombre?.charAt(0)?.toUpperCase() ?? '?';
  });

  avatarColor = computed(() => {
    const colors = ['av-c0','av-c1','av-c2','av-c3','av-c4','av-c5'];
    const name   = this.usuario()?.nombre ?? '';
    return colors[name.charCodeAt(0) % colors.length] ?? 'av-c0';
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.http.get<UsuarioDto>(`${environment.api_url}api/usuarios/me`).subscribe({
      next: u => {
        this.usuario.set(u);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar tu perfil.');
        this.cargando.set(false);
      }
    });
  }

  abrirEdicion(): void {
    const u = this.usuario();
    if (!u) return;
    this.fNombre    = u.nombre;
    this.fApellidos = u.apellidos;
    this.fEmail     = u.email;
    this.editando.set(true);
  }

  cancelarEdicion(): void {
    this.editando.set(false);
  }

  guardar(): void {
    if (!this.fNombre.trim() || !this.fApellidos.trim() || !this.fEmail.trim()) return;
    this.guardando.set(true);
    this.http.put<UsuarioDto>(`${environment.api_url}api/usuarios/me`, {
      nombre:    this.fNombre.trim(),
      apellidos: this.fApellidos.trim(),
      email:     this.fEmail.trim()
    }).subscribe({
      next: u => {
        this.usuario.set(u);
        this.guardando.set(false);
        this.editando.set(false);
        this.toast.show('Perfil actualizado correctamente.', 'success');

        // Actualizar AUTH_INFO en localStorage para que el sidebar refleje el cambio
        const info = this.auth.getUserInfo();
        if (info) {
          localStorage.setItem('AUTH_INFO', JSON.stringify({
            ...info,
            nombre:    u.nombre,
            apellidos: u.apellidos,
            email:     u.email
          }));
        }
      },
      error: () => {
        this.guardando.set(false);
        this.toast.show('Error al guardar el perfil. Intenta nuevamente.', 'error');
      }
    });
  }

  formatFecha(f: string): string {
    return new Date(f).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
}
