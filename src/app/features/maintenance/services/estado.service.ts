import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Estado } from "../models/estado.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class EstadoService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getAll():Observable<Estado[]>{
        return this.http.get<Estado[]>(`${this.api}api/configuracion/estados`);
    }
    create(data:Estado):Observable<Estado>{
        return this.http.post<Estado>(`${this.api}api/configuracion/estados`,data);
    }
    update(id:number,data:Estado):Observable<Estado>{
        return this.http.post<Estado>(`${this.api}api/configuracion/estados/${id}`,data);
    }
    delete(id:number):Observable<void>{
        return this.http.delete<void>(`${this.api}api/configuracion/estados/${id}`);
    }
}