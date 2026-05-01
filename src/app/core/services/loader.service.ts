import { Injectable,signal,computed } from "@angular/core";
@Injectable({providedIn:'root'})
export class LoaderService{
    //Contador de request activas(pueded haber varias a la vez)
    private activeRequest=signal(0)
    //true si hay almenos una request en curso
    isLoading = computed(()=>this.activeRequest()>0);
    start(){this.activeRequest.update(n=>n+1);}
    stop(){this.activeRequest.update(n=>Math.max(0,n-1));}
}