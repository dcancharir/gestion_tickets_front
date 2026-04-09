import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Rol } from "../models/rol.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class RolService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getAll():Observable<Rol[]>{
        return this.http.get<Rol[]>(`${this.api}api/roles`);
    }
    create(data:Rol):Observable<Rol>{
        return this.http.post<Rol>(`${this.api}api/roles`,data);
    }
    update(id:number,data:Rol):Observable<Rol>{
        return this.http.post<Rol>(`${this.api}api/roles/${id}`,data);
    }
    delete(id:number):Observable<void>{
        return this.http.delete<void>(`${this.api}api/roles/${id}`);
    }
}