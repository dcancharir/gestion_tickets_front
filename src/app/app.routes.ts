import { Routes } from '@angular/router';
import { UserList } from './features/maintenance/pages/users/user-list/user-list';
import { LayoutBase } from './layout/layout-base/layout-base';
import { LayoutLogin } from './layout/layout-login/layout-login';
import { RoleList } from './features/maintenance/pages/roles/role-list/role-list';
import { Dashboard } from './features/principal/pages/dashboard/dashboard';
import { SedeList } from './features/maintenance/pages/sedes/sede-list/sede-list';
import { PrioridadList } from './features/maintenance/pages/prioridades/prioridad-list/prioridad-list';
import { EstadoList } from './features/maintenance/pages/estados/estado-list/estado-list';
import { CategoriaList } from './features/maintenance/pages/categorias/categoria-list/categoria-list';
import { SlaList } from './features/maintenance/pages/slas/sla-list/sla-list';
import { PermisosAddRemove } from './features/maintenance/pages/permisos/permisos-add-remove';
import { TicketListaComponent } from './features/ticket/component/ticket-lista/ticket-lista.component';
import { TicketDetalleComponent } from './features/ticket/component/ticket-detalle/ticket-detalle';
import { ArticuloList } from './features/conocimiento/pages/articulo-list/articulo-list';
import { ArticuloDetalleComponent } from './features/conocimiento/pages/articulo-detalle/articulo-detalle';
import { AccesoDenegado } from './features/acceso-denegado/acceso-denegado';
import { permisosGuard } from './core/guards/permisos.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LayoutLogin },
    { path: 'acceso-denegado', component: AccesoDenegado },

    // ── Dashboard ────────────────────────────────────────────────────────────
    {
        path: 'dashboard',
        component: LayoutBase,
        canActivate: [permisosGuard],
        children: [
            { path: '', component: Dashboard }
        ]
    },

    // ── Base de Conocimiento ─────────────────────────────────────────────────
    {
        path: 'conocimiento',
        component: LayoutBase,
        canActivate: [permisosGuard],
        children: [
            { path: '',          component: ArticuloList },
            { path: 'articulos', component: ArticuloList },
            { path: ':publicId', component: ArticuloDetalleComponent }
        ]
    },

    // ── Tickets — vistas de lista ────────────────────────────────────────────
    {
        path: 'principal',
        component: LayoutBase,
        children: [
            { path: '', redirectTo: 'mis-tickets', pathMatch: 'full' },
            { path: 'tickets',          component: TicketListaComponent, canActivate: [permisosGuard], data: { modo: 'todos' } },
            { path: 'mis-tickets',      component: TicketListaComponent, canActivate: [permisosGuard], data: { modo: 'mis-tickets' } },
            { path: 'mis-asignaciones', component: TicketListaComponent, canActivate: [permisosGuard], data: { modo: 'mis-asignaciones' } },
        ]
    },

    // ── Detalle de ticket ────────────────────────────────────────────────────
    {
        path: 'tickets',
        component: LayoutBase,
        children: [
            { path: ':publicId', component: TicketDetalleComponent }
        ]
    },

    // ── Mantenimientos ───────────────────────────────────────────────────────
    {
        path: 'maintenance',
        component: LayoutBase,
        children: [
            { path: '',            component: SedeList,        canActivate: [permisosGuard] },
            { path: 'sedes',       component: SedeList,        canActivate: [permisosGuard] },
            { path: 'prioridades', component: PrioridadList,   canActivate: [permisosGuard] },
            { path: 'estados',     component: EstadoList,      canActivate: [permisosGuard] },
            { path: 'categorias',  component: CategoriaList,   canActivate: [permisosGuard] },
            { path: 'slas',        component: SlaList,         canActivate: [permisosGuard] },
        ]
    },

    // ── Seguridad ────────────────────────────────────────────────────────────
    {
        path: 'security',
        component: LayoutBase,
        children: [
            { path: 'users',    component: UserList,          canActivate: [permisosGuard] },
            { path: 'roles',    component: RoleList,          canActivate: [permisosGuard] },
            { path: 'permisos', component: PermisosAddRemove, canActivate: [permisosGuard] },
        ]
    },

    { path: '**', redirectTo: 'login' }
];
