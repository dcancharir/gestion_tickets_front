import { Component, computed, inject, resource, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';
import { IncidenciaService } from "../../../services/incidencia.service";
import { firstValueFrom } from "rxjs";
import { DatePipe } from '@angular/common';
import { IncidenciaDetail } from "../../../models/incidencia-detail.model";
import { TicketAssign } from "../ticket-actions/ticket-assign";
@Component({
       selector : 'app-ticket-details',
    templateUrl : './ticket-details.html',
    imports:[DatePipe,TicketAssign]
})
export class TicketDetails{
    private route = inject(ActivatedRoute)
    private ticketService = inject(IncidenciaService)
    // Convertimos el paramMap de Observable a Signal
    private params = toSignal(this.route.paramMap);
    // Creamos señales computadas para obtener cada valor
    ticketId = computed<string>(() => this.params()?.get('ticketId')??'');

    incidencia = resource({
        loader : ()=>firstValueFrom(this.ticketService.getByPublicId(this.ticketId()))
    })
    modalAsignarAbierto = signal(false)
    incidenciaSeleccionada = signal<IncidenciaDetail|null>(null)
    addComment(){
        
    }
    asignar(incidenciaDetail:IncidenciaDetail | null){
        this.incidenciaSeleccionada.set(incidenciaDetail);
        this.modalAsignarAbierto.set(true);
    }
    onAsignado(){
        this.modalAsignarAbierto.set(false);
        this.incidencia.reload();
    }
    cerrar(){

    }
    reabrir(){

    }
    escalar(){

    }
    resolver(){

    }
}