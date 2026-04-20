import { Component, Inject, inject, input, linkedSignal, output, signal, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncidenciaCreate } from '../../../models/incidencia-create.model';
import { IncidenciaService } from "../../../services/incidencia.service";
import { Incidencia } from '../../../models/incidencia.model';
import { CategoriaService } from '../../../../maintenance/services/categoria.service';
import { PrioridadService } from '../../../../maintenance/services/prioridad.service';
import { SedeService } from '../../../../maintenance/services/sede.service';
import { firstValueFrom } from 'rxjs';
@Component({
    selector : 'app-ticket-add-edit',
    templateUrl : './ticket-add-edit.html',
    imports : [FormsModule]
})
export class TicketAddEdit{
    private incidenciaService = inject(IncidenciaService);
    private categoriaService = inject(CategoriaService)
    private prioridadService = inject(PrioridadService) 
    private sedeService = inject(SedeService)


    categorias = resource({
        loader : ()=>firstValueFrom(this.categoriaService.getAll())
    })
    prioridades = resource({
        loader : ()=>firstValueFrom(this.prioridadService.getAll())
    })
    sedes = resource({
        loader : ()=>firstValueFrom(this.sedeService.getAll())
    })


    // input() / output() reemplazan @Input() / @Output()
    incidencia = input<IncidenciaCreate|null>(null);
    cerrado = output();
    guardando = signal(false);
    // linkedSignal: form sincronizado con el input
    form = linkedSignal(()=>({
        titulo : this.incidencia()?.titulo ?? '',
        descripcion : this.incidencia()?.descripcion ?? '',
        categoriaId : this.incidencia()?.categoriaId ?? 0,
        canalReporte : this.incidencia()?.canalReporte ?? '',
        impacto : this.incidencia()?.impacto ?? 0,
        urgencia : this.incidencia()?.urgencia ?? 0,
        prioridadId : this.incidencia()?.prioridadId ?? 0,
        sedeId : this.incidencia()?.sedeId ?? 0,
    }))
    guardar(){
        this.incidenciaService.create(this.form()).subscribe({
            next:(response)=>{
                if(response){
                    this.guardando.set(true);
                    this.cerrado.emit();
                }
            },
            error:()=>{},
            complete:()=>{
            }
        });
    }
    closeModal(){
        this.guardando.set(false);
        this.cerrado.emit();
    }
}