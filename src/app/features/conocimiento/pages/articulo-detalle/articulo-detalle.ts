import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConocimientoService } from '../../services/conocimiento.service';
import { ArticuloAddEdit } from '../articulo-add-edit/articulo-add-edit';
import { ArticuloDetalle } from '../../models/conocimiento.model';

@Component({
  selector: 'app-articulo-detalle',
  standalone: true,
  imports: [CommonModule, ArticuloAddEdit],
  templateUrl: './articulo-detalle.html'
})
export class ArticuloDetalleComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private svc    = inject(ConocimientoService);

  articulo  = signal<ArticuloDetalle | null>(null);
  cargando  = signal(true);
  error     = signal<string | null>(null);
  modalEdit = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('publicId')!;
    this.svc.getByPublicId(id).subscribe({
      next:  data => { this.articulo.set(data); this.cargando.set(false); },
      error: ()   => { this.error.set('No se pudo cargar el artículo.'); this.cargando.set(false); }
    });
  }

  volver(): void { this.router.navigate(['/conocimiento']); }

  onModalCerrar(guardo: boolean): void {
    this.modalEdit.set(false);
    if (guardo) {
      const id = this.route.snapshot.paramMap.get('publicId')!;
      this.cargando.set(true);
      this.svc.getByPublicId(id).subscribe({
        next:  data => { this.articulo.set(data); this.cargando.set(false); },
        error: ()   => { this.cargando.set(false); }
      });
    }
  }

  formatFecha(f: string): string {
    return new Date(f).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
}
