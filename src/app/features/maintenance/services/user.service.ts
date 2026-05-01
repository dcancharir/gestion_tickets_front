import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Usuario } from "../models/usuario.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UserService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getAll():Observable<Usuario[]>{
        return this.http.get<Usuario[]>(`${this.api}api/usuarios`);
    }
    create(data:Usuario):Observable<Usuario>{
        return this.http.post<Usuario>(`${this.api}api/usuarios`,data);
    }
    update(id:string,data:Usuario):Observable<Usuario>{
        return this.http.post<Usuario>(`${this.api}api/usuarios/${id}`,data);
    }
    delete(id:string):Observable<void>{
        return this.http.delete<void>(`${this.api}api/usuarios/${id}`);
    }
    GetByRolId(rolId:number):Observable<Usuario[]>{
        return this.http.get<Usuario[]>(`${this.api}api/usuarios/getbyrolid/${rolId}`);
    }
}