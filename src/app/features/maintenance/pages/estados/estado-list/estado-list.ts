import { Component,inject,signal,resource } from "@angular/core";
import { EstadoService } from "../../../services/estado.service";
import { firstValueFrom } from "rxjs";
import { Estado } from "../../../models/estado.model";
import { EstadoAddEdit } from "../estado-add/estado-add-edit";
@Component({
    selector : 'app-estado-list',
    templateUrl : './estado-list.html',
    imports : [EstadoAddEdit]
})
export class EstadoList{
    private estadoService = inject(EstadoService);
    estados = resource({
        loader : ()=>firstValueFrom(this.estadoService.getAll())
    })
    modalAbierto = signal(false)
    estadoSeleccionado = signal<Estado|null>(null)
    openModal(estado:Estado | null){
        this.estadoSeleccionado.set(estado);
        this.modalAbierto.set(true);
        console.log(this.modalAbierto())
    }
    onGuardado(estado : Estado){
        this.modalAbierto.set(false);
        this.estados.reload();
    }
    eliminar(id:number){
        console.log(id)
    }
    getEstadoClass(estado: number | string): string {
    switch (estado) {
      case 1:
      case 'Registrado':
        return 'secondary';

      case 2:
      case 'Asignado':
        return 'info';

      case 3:
      case 'En Diagnóstico':
        return 'primary';

      case 4:
      case 'En Progreso':
        return 'warning';

      case 5:
      case 'Pendiente':
        return 'muted';

      case 6:
      case 'Resuelto':
        return 'success';

      case 7:
      case 'Cerrado':
        return 'dark';

      case 8:
      case 'Reabierto':
        return 'danger';

      case 9:
      case 'Cancelado':
        return 'danger';

      default:
        return 'dark';
    }
  }
}