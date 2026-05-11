import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { ToastService } from "../services/toast.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth         = inject(AuthService);
    const toastService = inject(ToastService);
    const token        = auth.getToken();

    const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError(err => {
            toastService.dismissAll();

            if (err.status === 401) {
                // Token expirado o inválido → cerrar sesión automáticamente
                auth.logout();
            }

            if (err.status === 403) {
                // Mostrar el mensaje que devuelve el backend si está disponible
                const msg: string = err.error?.mensaje ?? 'No tienes permiso para realizar esta acción.';
                toastService.show(msg, 'error');
            }

            return throwError(() => err);
        })
    );
};