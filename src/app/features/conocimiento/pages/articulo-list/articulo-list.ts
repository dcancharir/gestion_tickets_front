import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConocimientoService } from '../../services/conocimiento.service';
import { ArticuloAddEdit } from '../articulo-add-edit/articulo-add-edit';
import { ArticuloListItem, ArticuloDetalle } from '../../models/conocimiento.model';

@Component({
  selector: 'app-articulo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ArticuloAddEdit],
  templateUrl: './articulo-list.html'
})
export class ArticuloList {
  private svc    = inject(ConocimientoService);
  private router = inject(Router);

  articulos    = signal<ArticuloListItem[]>([]);
  cargando     = signal(false);
  error        = signal<string | null>(null);
  busqueda     = signal('');
  soloActivos  = signal(false);

  modalAbierto     = signal(false);
  articuloEditar   = signal<ArticuloDetalle | null>(null);
  cargandoDetalle  = signal(false);

  articulosFiltrados = computed(() => {
    const termino = this.busqueda().toLowerCase().trim();
    const activos = this.soloActivos();
    return this.articulos().filter(a =>
      (!activos || a.activo) &&
      (!termino ||
        a.titulo.toLowerCase().includes(termino) ||
        (a.categoria ?? '').toLowerCase().includes(termino) ||
        a.creadoPor.toLowerCase().includes(termino))
    );
  });

  constructor() { this.cargar(); }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.svc.getAll().subscribe({
      next:  data => { this.articulos.set(data); this.cargando.set(false); },
      error: ()   => { this.error.set('No se pudieron cargar los artículos.'); this.cargando.set(false); }
    });
  }

  verDetalle(publicId: string): void {
    this.router.navigate(['/conocimiento', publicId]);
  }

  openModal(articulo: ArticuloListItem | null): void {
    if (articulo) {
      this.cargandoDetalle.set(true);
      this.svc.getByPublicId(articulo.publicId).subscribe({
        next: det => {
          this.articuloEditar.set(det);
          this.cargandoDetalle.set(false);
          this.modalAbierto.set(true);
        },
        error: () => this.cargandoDetalle.set(false)
      });
    } else {
      this.articuloEditar.set(null);
      this.modalAbierto.set(true);
    }
  }

  onModalCerrar(guardo: boolean): void {
    this.modalAbierto.set(false);
    this.articuloEditar.set(null);
    if (guardo) this.cargar();
  }

  eliminar(a: ArticuloListItem): void {
    if (!confirm(`¿Eliminar el artículo "${a.titulo}"?`)) return;
    this.svc.delete(a.publicId).subscribe({
      next:  () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar el artículo.')
    });
  }

  formatFecha(f: string): string {
    return new Date(f).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
