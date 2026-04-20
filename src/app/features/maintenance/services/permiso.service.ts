import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Permiso } from "../models/permiso.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PermisoService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getAll():Observable<Permiso[]>{
        return this.http.get<Permiso[]>(`${this.api}api/permiso/getall`);
    }
}