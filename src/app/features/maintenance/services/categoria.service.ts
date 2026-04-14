import { Injectable,inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Categoria } from "../models/categoria.model";
import { environment } from "../../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private api = environment.api_url;
    private http = inject(HttpClient);
    getAll():Observable<Categoria[]>{
        return this.http.get<Categoria[]>(`${this.api}api/categorias`);
    }
    create(data:Categoria):Observable<Categoria>{
        return this.http.post<Categoria>(`${this.api}api/categorias`,data);
    }
    update(id:number,data:Categoria):Observable<Categoria>{
        return this.http.post<Categoria>(`${this.api}api/categorias/${id}`,data);
    }
    delete(id:number):Observable<void>{
        return this.http.delete<void>(`${this.api}api/categorias/${id}`);
    }
}