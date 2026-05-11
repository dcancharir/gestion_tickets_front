import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ArticuloListItem, ArticuloDetalle,
  CrearArticuloDto, ActualizarArticuloDto
} from '../models/conocimiento.model';

@Injectable({ providedIn: 'root' })
export class ConocimientoService {
  private http = inject(HttpClient);
  private base = `${environment.api_url}api/base-conocimiento`;

  getAll(soloActivos = false): Observable<ArticuloListItem[]> {
    const params = new HttpParams().set('soloActivos', soloActivos);
    return this.http.get<ArticuloListItem[]>(this.base, { params });
  }

  getByPublicId(publicId: string): Observable<ArticuloDetalle> {
    return this.http.get<ArticuloDetalle>(`${this.base}/${publicId}`);
  }

  buscar(termino: string): Observable<ArticuloListItem[]> {
    const params = new HttpParams().set('termino', termino);
    return this.http.get<ArticuloListItem[]>(`${this.base}/buscar`, { params });
  }

  create(dto: CrearArticuloDto): Observable<ArticuloDetalle> {
    return this.http.post<ArticuloDetalle>(this.base, dto);
  }

  update(publicId: string, dto: ActualizarArticuloDto): Observable<ArticuloDetalle> {
    return this.http.put<ArticuloDetalle>(`${this.base}/${publicId}`, dto);
  }

  delete(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${publicId}`);
  }
}
