import { Component,inject,signal,resource } from "@angular/core";
import { CategoriaService } from "../../../services/categoria.service";
import { firstValueFrom } from "rxjs";
import { Categoria } from "../../../models/categoria.model";
import { CategoriaAddEdit } from "../categoria-add/categoria-add-edit";
@Component({
    selector : 'app-categoria-list',
    templateUrl : './categoria-list.html',
    imports : [CategoriaAddEdit]
})
export class CategoriaList{
    private categoriaService = inject(CategoriaService);
    categorias = resource({
        loader : ()=>firstValueFrom(this.categoriaService.getAll())
    })
    modalAbierto = signal(false)
    categoriaSeleccionada = signal<Categoria|null>(null)
    openModal(categoria:Categoria | null){
        this.categoriaSeleccionada.set(categoria);
        this.modalAbierto.set(true);
        console.log(this.modalAbierto())
    }
    onGuardado(categoria : Categoria){
        this.modalAbierto.set(false);
        this.categorias.reload();
    }
    eliminar(id:number){
        console.log(id)
    }
}