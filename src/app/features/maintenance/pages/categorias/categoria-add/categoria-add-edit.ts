import { Component, Inject, inject, input, linkedSignal, output, signal, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from "../../../services/categoria.service";
@Component({
    selector : 'app-categoria-add-edit',
    templateUrl : './categoria-add-edit.html',
    imports : [FormsModule]
})
export class CategoriaAddEdit{
    private categoriaService = inject(CategoriaService);
    // input() / output() reemplazan @Input() / @Output()
    categoria = input<Categoria|null>(null);
    guardado = output<Categoria>();
    cerrado = output();
    guardando = signal(false);
    // linkedSignal: form sincronizado con el input
    form = linkedSignal(()=>({
        categoriaId : this.categoria()?.categoriaId ?? 0,
        nombre : this.categoria()?.nombre ?? '',
        descripcion : this.categoria()?.descripcion ?? '',
        activo : this.categoria()?.activo ?? false,
    }))
    guardar(){
        const u = this.categoria()
        const obs = u 
        ? this.categoriaService.update(u.categoriaId,this.form())
        : this.categoriaService.create(this.form());

        this.guardando.set(true);

        obs.subscribe({
            next : (u)=>this.guardado.emit(u),
            error : ()=>this.guardando.set(false)
        });
    }
    closeModal(){
        this.guardando.set(false);
        this.cerrado.emit();
    }
}