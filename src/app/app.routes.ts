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
import { PermisosAddRemove } from './features/maintenance/pages/permisos/permisos-add-remove';
import { TicketListaComponent } from './features/ticket/component/ticket-lista/ticket-lista.component';
import { TicketDetalleComponent } from './features/ticket/component/ticket-detalle/ticket-detalle';
import { ArticuloList } from './features/conocimiento/pages/articulo-list/articulo-list';
import { ArticuloDetalleComponent } from './features/conocimiento/pages/articulo-detalle/articulo-detalle';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LayoutLogin },

    // ── Dashboard ────────────────────────────────────────────────────────────
    {
        path: 'dashboard',
        component: LayoutBase,
        children: [
            { path: '', component: Dashboard }
        ]
    },
 // ── Base de Conocimiento ─────────────────────────────────────────────────
    {
        path: 'conocimiento',
        component: LayoutBase,
        children: [
            { path: '',          component: ArticuloList },
            { path: 'articulos',          component: ArticuloList },
            { path: ':publicId', component: ArticuloDetalleComponent }
        ]
    },
    // ── Tickets — vistas de lista ────────────────────────────────────────────
    {
        path: 'principal',
        component: LayoutBase,
        children: [
            { path: '', redirectTo: 'mis-tickets', pathMatch: 'full' },
            { path: 'tickets',          component: TicketListaComponent, data: { modo: 'todos' } },
            { path: 'mis-tickets',      component: TicketListaComponent, data: { modo: 'mis-tickets' } },
            { path: 'mis-asignaciones', component: TicketListaComponent, data: { modo: 'mis-asignaciones' } },
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
            { path: '',            component: SedeList },
            { path: 'prioridades', component: PrioridadList },
            { path: 'estados',     component: EstadoList },
            { path: 'categorias',  component: CategoriaList },
            { path: 'sedes',       component: SedeList },
        ]
    },

    // ── Seguridad ────────────────────────────────────────────────────────────
    {
        path: 'security',
        component: LayoutBase,
        children: [
            { path: 'users',    component: UserList },
            { path: 'roles',    component: RoleList },
            { path: 'permisos', component: PermisosAddRemove },
        ]
    },

   

    { path: '**', redirectTo: 'login' }
];
