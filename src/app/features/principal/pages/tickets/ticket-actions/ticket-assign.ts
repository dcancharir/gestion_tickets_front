import { Component, inject, input, output, resource, Signal, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IncidenciaDetail } from "../../../models/incidencia-detail.model";
import { DatePipe } from "@angular/common";
import { UserService } from "../../../../maintenance/services/user.service";
import { firstValueFrom } from "rxjs";
import { IncidenciaService } from "../../../services/incidencia.service";
import { ToastService } from "../../../../../core/services/toast.service";
@Component({
    selector : 'app-ticket-assign',
    template : `
        <div   [class.show]="true"  [style.display]="'block'" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-4">Incidencia</h1>
                        <button type="button" class="btn-close" (click)="closeModal()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-12">
                                <div class="pure-card rounded-custom card-bg shadow-custom">
                                   
                                    <div class="pure-card-body">
                                        <div class="row gy-5">
                                            <div id="about" class="mb-10">
                                            <h3 class="h4 mb-5">{{incidencia()?.titulo}}</h3>
                                            <p style="color: black;">{{incidencia()?.descripcion}}</p>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="text-center">
                                                    <span class="fw-medium" style="color: black;">Registro</span>
                                                    <h4 class="fs-4">{{ incidencia()?.fechaRegistro | date:'yyyy-MM-dd HH:mm' }}</h4>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="text-center">
                                                    <span class="fw-medium" style="color: black;">Categoria </span>
                                                    <h4 class="fs-4">{{ incidencia()?.categoria }}</h4>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="text-center">
                                                    <span class="fw-medium" style="color: black;">Prioridad</span>
                                                    <h4 class="fs-4">{{ incidencia()?.prioridad }}</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row row-cols-1 gy-5">
                                            <div class="col">
                                                <label for="" class="form-label">Tecnico <span class="text-danger fw-bold">*</span></label>
                                                <select class="form-select" [(ngModel)]="publicId">
                                                    <option value="">Seleccione Tecnico</option>
                                                    @for(r of tecnicos.value(); track r.publicId){
                                                        <option value="{{r.publicId}}">{{r.nombre}}</option>
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-label-danger" (click)="closeModal()">Close</button>
                        <button type="button" class="btn btn-primary" (click)="asignar()">Asignar</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    imports : [FormsModule,DatePipe]
})
export class TicketAssign{
    toast = inject(ToastService)
    incidenciaService = inject(IncidenciaService)
    publicId = signal<string|null>(null)
    usuariosService = inject(UserService)
    incidencia = input<IncidenciaDetail|null>(null);
    asignado = output();
    cerrado = output();
    asignando = signal(false);
    tecnicos = resource({
        loader:()=>firstValueFrom(this.usuariosService.GetByRolId(2))
    })
    asignar(){
        const incidenciaPublicId = this.incidencia()?.publicId
        const tecnicoPublicId = this.publicId()
        if(!tecnicoPublicId){
            this.toast.show('Debe seleccionar un tecnico a asignar','error')
            return
        }
        if(!incidenciaPublicId ){
            this.toast.show('Ha ocurrido un error con la incidedncia','error')
            return
        }
        this.incidenciaService.asignarTicket(incidenciaPublicId,tecnicoPublicId).subscribe({
            next:(result)=>{
                if(result){
                    this.toast.show('Se asigno el ticket','success')
                    this.asignado.emit()
                }
            },
            error:(err)=>{
                this.toast.show('Ocurrio un error al asignar el ticket','error')
            },
            complete:()=>{
                this.asignando.set(false)
            }
        })
    }
    closeModal(){
        this.asignando.set(false);
        this.cerrado.emit();
    }
}