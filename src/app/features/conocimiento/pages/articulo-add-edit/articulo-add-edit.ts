import { Component, inject, input, output, signal, resource, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ConocimientoService } from '../../services/conocimiento.service';
import { CategoriaService } from '../../../maintenance/services/categoria.service';
import { ArticuloDetalle } from '../../models/conocimiento.model';

@Component({
  selector: 'app-articulo-add-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './articulo-add-edit.html'
})
export class ArticuloAddEdit implements OnInit {
  private svc      = inject(ConocimientoService);
  private catSvc   = inject(CategoriaService);

  articulo = input<ArticuloDetalle | null>(null);
  cerrar   = output<boolean>();           // true = guardó, false = canceló

  categorias = resource({ loader: () => firstValueFrom(this.catSvc.getAll()) });

  guardando = signal(false);
  error     = signal<string | null>(null);

  form = signal({
    titulo:      '',
    problema:    '',
    solucion:    '',
    categoriaId: null as number | null,
    activo:      true
  });

  ngOnInit(): void {
    const a = this.articulo();
    if (a) {
      this.form.set({
        titulo:      a.titulo,
        problema:    a.problema,
        solucion:    a.solucion,
        categoriaId: a.categoriaId,
        activo:      a.activo
      });
    }
  }

  get esEdicion(): boolean { return !!this.articulo(); }

  guardar(): void {
    const f = this.form();
    if (!f.titulo.trim() || !f.problema.trim() || !f.solucion.trim()) {
      this.error.set('Título, problema y solución son obligatorios.');
      return;
    }
    this.guardando.set(true);
    this.error.set(null);

    const obs$ = this.esEdicion
      ? this.svc.update(this.articulo()!.publicId, f)
      : this.svc.create(f);

    obs$.subscribe({
      next:  () => { this.guardando.set(false); this.cerrar.emit(true); },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar el artículo. Intenta nuevamente.');
      }
    });
  }

  closeModal(): void { this.cerrar.emit(false); }
}
