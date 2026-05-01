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
    create(data:FormData):Observable<Incidencia>{
        return this.http.post<Incidencia>(`${this.api}api/incidencias`,data);
    }
    // create(data:IncidenciaCreate):Observable<Incidencia>{
    //     return this.http.post<Incidencia>(`${this.api}api/incidencias`,data);
    // }
     getByPublicId(publicId:string):Observable<IncidenciaDetail>{
        return this.http.get<IncidenciaDetail>(`${this.api}api/incidencias/${publicId}`);
    }
    getMisAsignaciones():Observable<Incidencia[]>{
        return this.http.get<Incidencia[]>(`${this.api}api/incidencias/mis-asignaciones`);
    }
     getMisTickets():Observable<Incidencia[]>{
        return this.http.get<Incidencia[]>(`${this.api}api/incidencias/mis-tickets`);
    }
    asignarTicket(ticketPublicId:string, tecnicoPublicId:string):Observable<Incidencia>{
        return this.http.patch<Incidencia>(`${this.api}api/incidencias/${ticketPublicId}/asignar`,{"tecnicoPublicId":tecnicoPublicId});
    }
    estadoTicket(ticketPublicId:string, nuevoEstadoId:number, detalle:string):Observable<Incidencia>{
        return this.http.patch<Incidencia>(`${this.api}api/incidencias/${ticketPublicId}/estado`,{"nuevoEstadoId":nuevoEstadoId,"detalle":detalle});
    }
    resolverTicket(ticketPublicId:string, solucionAplicada:string, resueltoEnPrimerContacto:boolean = true):Observable<Incidencia>{
        return this.http.patch<Incidencia>(`${this.api}api/incidencias/${ticketPublicId}/resolver`,{"solucionAplicada":solucionAplicada,"resueltoEnPrimerContacto":resueltoEnPrimerContacto});
    }
    cerrarTicket(ticketPublicId:string, comentario:string):Observable<Incidencia>{
        return this.http.patch<Incidencia>(`${this.api}api/incidencias/${ticketPublicId}/cerrar`,{"comentario":comentario});
    }
    escalarTicket(ticketPublicId:string, tecnicoPublicId:string, motivo:string):Observable<Incidencia>{
        return this.http.patch<Incidencia>(`${this.api}api/incidencias/${ticketPublicId}/escalar`,{"tecnicoPublicId":tecnicoPublicId,"motivo":motivo});
    }
    reabrirTicket(ticketPublicId:string, motivo:string):Observable<Incidencia>{
        return this.http.patch<Incidencia>(`${this.api}api/incidencias/${ticketPublicId}/reabrir`,{"motivo":motivo});
    }
     comentarioTicket(ticketPublicId:string, mensaje:string, esInterno : boolean = true):Observable<Incidencia>{
        return this.http.patch<Incidencia>(`${this.api}api/incidencias/${ticketPublicId}/comentarios`,{"mensaje":mensaje,"esInterno":esInterno});
    }
}