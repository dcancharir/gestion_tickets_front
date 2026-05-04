import { Injectable,signal } from "@angular/core";
export interface Toast {
    id:number;
    message:string;
    type:'success'|'error'|'info'
}
@Injectable({providedIn:'root'})
export class ToastService {
    //Lista reactiva de toasts - el componente la lee con toasts()
    toasts = signal<Toast[]>([]);
    private nextId = 0;
    show(message : string, type : Toast['type']= 'success' ){
        const id = ++this.nextId;
        //Agrega el toast al signal
        this.toasts.update(list=>[...list,{id,message,type}])
        //Lo elimina automaticamente a los 3.5 segundos
        setTimeout(() => {
            this.dismiss(id)
        }, 3500);

    }
    dismiss(id:number){
        this.toasts.update(list=>list.filter(t=>t.id !== id))
    }
}