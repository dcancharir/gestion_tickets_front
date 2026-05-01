import { Inject,inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { finalize } from "rxjs";
import { LoaderService } from "../services/loader.service";
//Interceptor global - activa el Loader en cualquier request HTTP
export const loaderInterceptor : HttpInterceptorFn = (req,next)=>{
    const loader = inject(LoaderService);
    loader.start()
    return next(req).pipe(
        finalize(()=>{loader.stop()})//se ejecuta siempre(ok o error)
    )
}