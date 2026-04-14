import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Prioridad } from "../models/prioridad.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PrioridadService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getAll():Observable<Prioridad[]>{
        return this.http.get<Prioridad[]>(`${this.api}api/configuracion/prioridades`);
    }
    create(data:Prioridad):Observable<Prioridad>{
        return this.http.post<Prioridad>(`${this.api}api/configuracion/prioridades`,data);
    }
    update(id:number,data:Prioridad):Observable<Prioridad>{
        return this.http.post<Prioridad>(`${this.api}api/configuracion/prioridades/${id}`,data);
    }
    delete(id:number):Observable<void>{
        return this.http.delete<void>(`${this.api}api/configuracion/prioridades/${id}`);
    }
}