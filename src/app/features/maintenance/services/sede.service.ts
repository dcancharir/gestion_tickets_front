import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Sede } from "../models/sede.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class SedeService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getAll():Observable<Sede[]>{
        return this.http.get<Sede[]>(`${this.api}api/sedes`);
    }
    create(data:Sede):Observable<Sede>{
        return this.http.post<Sede>(`${this.api}api/sedes`,data);
    }
    update(id:number,data:Sede):Observable<Sede>{
        return this.http.post<Sede>(`${this.api}api/sedes/${id}`,data);
    }
    delete(id:number):Observable<void>{
        return this.http.delete<void>(`${this.api}api/sedes/${id}`);
    }
}