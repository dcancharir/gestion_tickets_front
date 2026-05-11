import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Sede } from "../models/sede.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UsuarioSedeService {
    private api = environment.api_url;
    private http = inject(HttpClient);

    getSedes(publicId: string): Observable<Sede[]> {
        return this.http.get<Sede[]>(`${this.api}api/usuariosede/${publicId}/sedes`);
    }

    asignarSedes(publicId: string, sedeIds: number[]): Observable<void> {
        return this.http.post<void>(`${this.api}api/usuariosede/${publicId}/sedes`, sedeIds);
    }
}
