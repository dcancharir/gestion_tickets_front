import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sla, CrearSlaDto, ActualizarSlaDto } from '../models/sla.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SlaService {
    private api  = environment.api_url;
    private http = inject(HttpClient);

    getAll(): Observable<Sla[]> {
        return this.http.get<Sla[]>(`${this.api}api/sla`);
    }

    getById(id: number): Observable<Sla> {
        return this.http.get<Sla>(`${this.api}api/sla/${id}`);
    }

    create(dto: CrearSlaDto): Observable<Sla> {
        return this.http.post<Sla>(`${this.api}api/sla`, dto);
    }

    update(id: number, dto: ActualizarSlaDto): Observable<Sla> {
        return this.http.put<Sla>(`${this.api}api/sla/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}api/sla/${id}`);
    }
}
