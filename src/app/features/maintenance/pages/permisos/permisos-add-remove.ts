import { Component, computed, inject, resource, signal } from "@angular/core";
import { PermisoService } from "../../services/permiso.service";
import { BehaviorSubject, catchError, firstValueFrom, of, switchMap } from "rxjs";
import { combineLatest } from "rxjs";
import { Permiso } from "../../models/permiso.model";
import { RolService } from "../../services/rol.service";
import { PermisoRolService } from "../../services/permiso-rol.service";
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ToastService } from "../../../../core/services/toast.service";

interface GrupoPermisos { controlador: string; permisos: Permiso[]; }

@Component({
    selector: 'app-permisos-add-remove',
    templateUrl: './permisos-add-remove.html',
    styleUrl: './permisos-add-remove.css',
    imports: [FormsModule]
})
export class PermisosAddRemove {
    toastService     = inject(ToastService);
    permisoService   = inject(PermisoService);
    rolService       = inject(RolService);
    permisoRolService = inject(PermisoRolService);

    sincronizando = signal(false);
    procesando    = signal<Set<string>>(new Set()); // controladores en proceso bulk

    // ── Recursos ──────────────────────────────────────────────────────────────
    permisos = resource({ loader: () => firstValueFrom(this.permisoService.getAll()) });
    roles    = resource({ loader: () => firstValueFrom(this.rolService.getAll()) });

    // ── Rol seleccionado ──────────────────────────────────────────────────────
    selectedRolId = signal<number | null>(null);
    private rolId$ = toObservable(this.selectedRolId);

    // Trigger de refresco manual (BehaviorSubject para forzar reload sin cambiar rolId)
    private refresh$ = new BehaviorSubject<void>(undefined);

    permisosRol = toSignal(
        combineLatest([this.rolId$, this.refresh$]).pipe(
            switchMap(([rolId]) => {
                if (!rolId) return of([]);
                return this.permisoRolService.getByRol(rolId).pipe(
                    catchError(err => { console.error(err); return of([]); })
                );
            })
        ),
        { initialValue: [] }
    );

    // ── Agrupación por controlador ────────────────────────────────────────────
    agrupadosArray = computed<GrupoPermisos[]>(() => {
        if (this.permisos.error()) return [];
        const data = this.permisos.value();
        if (!data) return [];

        const grouped = data.reduce((acc, permiso) => {
            const key = permiso.controlador.endsWith('Controller')
                ? permiso.controlador.replace('Controller', '')
                : permiso.controlador;
            // Normalizar también en el objeto para que el template no lo haga
            permiso.controlador = key;
            if (!acc[key]) acc[key] = [];
            acc[key].push(permiso);
            return acc;
        }, {} as Record<string, Permiso[]>);

        return Object.entries(grouped).map(([controlador, permisos]) => ({ controlador, permisos }));
    });

    // ── Estadísticas globales ─────────────────────────────────────────────────
    totalPermisos  = computed(() => this.permisos.value()?.length ?? 0);
    totalAsignados = computed(() => this.permisosRol().length);

    estadoGlobal = computed<'all' | 'some' | 'none'>(() => {
        const total     = this.totalPermisos();
        const asignados = this.totalAsignados();
        if (total === 0 || asignados === 0) return 'none';
        return asignados >= total ? 'all' : 'some';
    });

    // ── Helpers por permiso / grupo ───────────────────────────────────────────
    tienePermiso(permisoId: number): boolean {
        return this.permisosRol().some(pr => pr.permisoId === permisoId);
    }

    asignadosEnGrupo(grupo: GrupoPermisos): number {
        return grupo.permisos.filter(p => this.tienePermiso(p.permisoId)).length;
    }

    estadoGrupo(grupo: GrupoPermisos): 'all' | 'some' | 'none' {
        const a = this.asignadosEnGrupo(grupo);
        if (a === 0) return 'none';
        return a >= grupo.permisos.length ? 'all' : 'some';
    }

    esProcesando(controlador: string): boolean {
        return this.procesando().has(controlador);
    }

    // ── Recarga reactiva ──────────────────────────────────────────────────────
    private recargar(): void { this.refresh$.next(); }

    // ── Check individual ──────────────────────────────────────────────────────
    async addDeletePermission(event: Event, permisoId: number) {
        const checkbox = event.target as HTMLInputElement;
        const rolId    = this.selectedRolId();

        if (rolId === null) {
            checkbox.checked = !checkbox.checked;
            this.toastService.show('Seleccione un Rol', 'error');
            return;
        }

        try {
            if (checkbox.checked) {
                await firstValueFrom(this.permisoRolService.create(permisoId, rolId));
            } else {
                await firstValueFrom(this.permisoRolService.delete(permisoId, rolId));
            }
            this.recargar();
        } catch {
            checkbox.checked = !checkbox.checked; // revertir si falla
            this.toastService.show('Error al actualizar el permiso', 'error');
        }
    }

    // ── Check por controlador ─────────────────────────────────────────────────
    async toggleControlador(grupo: GrupoPermisos) {
        const rolId = this.selectedRolId();
        if (rolId === null) { this.toastService.show('Seleccione un Rol', 'error'); return; }

        const c = grupo.controlador;
        this.procesando.update(s => new Set([...s, c]));

        try {
            const estado = this.estadoGrupo(grupo);

            if (estado === 'all') {
                // Quitar todos los del grupo
                const asignados = grupo.permisos.filter(p => this.tienePermiso(p.permisoId));
                await Promise.all(asignados.map(p =>
                    firstValueFrom(this.permisoRolService.delete(p.permisoId, rolId))
                ));
            } else {
                // Agregar los que faltan
                const sinAsignar = grupo.permisos.filter(p => !this.tienePermiso(p.permisoId));
                await Promise.all(sinAsignar.map(p =>
                    firstValueFrom(this.permisoRolService.create(p.permisoId, rolId))
                ));
            }
            this.recargar();
        } catch {
            this.toastService.show('Error al actualizar permisos del controlador', 'error');
        } finally {
            this.procesando.update(s => { const n = new Set(s); n.delete(c); return n; });
        }
    }

    // ── Check global ──────────────────────────────────────────────────────────
    async toggleTodo() {
        const rolId = this.selectedRolId();
        if (rolId === null) { this.toastService.show('Seleccione un Rol', 'error'); return; }

        const todos  = this.permisos.value() ?? [];
        const estado = this.estadoGlobal();

        this.procesando.update(() => new Set(['__global__']));

        try {
            if (estado === 'all') {
                // Quitar todos
                await Promise.all(todos.map(p =>
                    firstValueFrom(this.permisoRolService.delete(p.permisoId, rolId))
                ));
            } else {
                // Agregar los que faltan
                const sinAsignar = todos.filter(p => !this.tienePermiso(p.permisoId));
                await Promise.all(sinAsignar.map(p =>
                    firstValueFrom(this.permisoRolService.create(p.permisoId, rolId))
                ));
            }
            this.recargar();
        } catch {
            this.toastService.show('Error al actualizar todos los permisos', 'error');
        } finally {
            this.procesando.update(() => new Set());
        }
    }

    // ── Selector de rol ───────────────────────────────────────────────────────
    onRolChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        this.selectedRolId.set(value ? Number(value) : null);
    }

    // ── Sincronizar ───────────────────────────────────────────────────────────
    async sincronizarPermisos() {
        this.sincronizando.set(true);
        try {
            await firstValueFrom(this.permisoService.sincronizar());
            this.permisos.reload();
            this.toastService.show('Permisos sincronizados correctamente', 'success');
        } catch {
            this.toastService.show('Error al sincronizar permisos', 'error');
        } finally {
            this.sincronizando.set(false);
        }
    }
}
