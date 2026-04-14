import { Component,inject,signal,resource } from "@angular/core";
import { PrioridadService } from "../../../services/prioridad.service";
import { firstValueFrom } from "rxjs";
import { Prioridad } from "../../../models/prioridad.model";
import { PrioridadAddEdit } from "../prioridad-add/prioridad-add-edit";
@Component({
    selector : 'app-prioridad-list',
    templateUrl : './prioridad-list.html',
    imports : [PrioridadAddEdit]
})
export class PrioridadList{
    private prioridadService = inject(PrioridadService);
    prioridades = resource({
        loader : ()=>firstValueFrom(this.prioridadService.getAll())
    })
    modalAbierto = signal(false)
    prioridadSeleccionada = signal<Prioridad|null>(null)
    openModal(prioridad:Prioridad | null){
        this.prioridadSeleccionada.set(prioridad);
        this.modalAbierto.set(true);
        console.log(this.modalAbierto())
    }
    onGuardado(prioridad : Prioridad){
        this.modalAbierto.set(false);
        this.prioridades.reload();
    }
    eliminar(id:number){
        console.log(id)
    }
    getPriorityClass(prioridad: number | string): string {
    switch (prioridad) {
      case 1:
      case 'Crítico':
        return 'danger';

      case 2:
      case 'Alto':
        return 'warning';

      case 3:
      case 'Medio':
        return 'primary';

      case 4:
      case 'Bajo':
        return 'secondary';

      case 5:
      case 'Planificado':
        return 'success';

      default:
        return 'dark';
    }
  }
}