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
}