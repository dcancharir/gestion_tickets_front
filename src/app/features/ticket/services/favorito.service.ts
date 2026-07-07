import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FavoritoItem } from '../model/favorito.model';
import { ToastService } from '../../../core/services/toast.service';

@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private http     = inject(HttpClient);
  private toastSvc = inject(ToastService);
  private api      = `${environment.api_url}api/favoritos`;

  private _items = signal<FavoritoItem[]>([]);
  readonly items = this._items.asReadonly();

  readonly publicIds = computed(() => new Set(this._items().map(f => f.publicId)));

  esFavorito(publicId: string): boolean {
    return this.publicIds().has(publicId);
  }

  cargar(): void {
    this.http.get<FavoritoItem[]>(this.api).subscribe({
      next:  items => this._items.set(items),
      error: () => {}
    });
  }

  agregar(publicId: string): void {
    this._items.update(items => [...items, { publicId } as FavoritoItem]); // optimistic
    this.http.post<void>(`${this.api}/${publicId}`, {}).subscribe({
      next:  () => this.cargar(),
      error: (err) => {
        this.cargar(); // rollback
        const msg = err?.error?.message ?? 'No se pudo agregar a favoritos.';
        this.toastSvc.show(msg, 'error');
      }
    });
  }

  eliminar(publicId: string): void {
    this._items.update(items => items.filter(f => f.publicId !== publicId)); // optimistic
    this.http.delete<void>(`${this.api}/${publicId}`).subscribe({
      error: () => this.cargar() // rollback
    });
  }

  toggle(publicId: string): void {
    this.esFavorito(publicId) ? this.eliminar(publicId) : this.agregar(publicId);
  }
}
