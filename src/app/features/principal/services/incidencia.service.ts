import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Incidencia } from "../models/incidencia.model";
import { IncidenciaCreate } from "../models/incidencia-create.model";
import { environment } from "../../../../environments/environment";
import { IncidenciaDetail } from "../models/incidencia-detail.model";

@Injectable({ providedIn: 'root' })
export class IncidenciaService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getAll():Observable<Incidencia[]>{
        return this.http.get<Incidencia[]>(`${this.api}api/incidencias`);
    }
    create(data:IncidenciaCreate):Observable<Incidencia>{
        return this.http.post<Incidencia>(`${this.api}api/incidencias`,data);
    }
     getByPublicId(publicId:string):Observable<IncidenciaDetail>{
        return this.http.get<IncidenciaDetail>(`${this.api}api/incidencias/${publicId}`);
    }
}