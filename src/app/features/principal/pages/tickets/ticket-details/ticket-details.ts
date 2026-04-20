import { Component, computed, inject, resource, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from '@angular/core/rxjs-interop';
import { IncidenciaService } from "../../../services/incidencia.service";
import { firstValueFrom } from "rxjs";
import { DatePipe } from '@angular/common';
@Component({
       selector : 'app-ticket-details',
    templateUrl : './ticket-details.html',
    imports:[DatePipe]
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

}