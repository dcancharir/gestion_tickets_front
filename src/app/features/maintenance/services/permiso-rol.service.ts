import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PermisoRol } from "../models/permiso-rol.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PermisoRolService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getByRol(rolid: number):Observable<PermisoRol[]>{
        return this.http.get<PermisoRol[]>(`${this.api}api/permiso/getbyrol/${rolid}`);
    }
    create(permisoId:number,rolId:number):Observable<PermisoRol>{
         return this.http.post<PermisoRol>(`${this.api}api/permiso`,{permisoId : permisoId, rolId : rolId});
    }
    delete(permisoId:number,rolId:number):Observable<void>{
        return this.http.delete<void>(`${this.api}api/permiso/${permisoId}/${rolId}`);
    }
}