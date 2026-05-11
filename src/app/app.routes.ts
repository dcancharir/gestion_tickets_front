import { Routes } from '@angular/router';
import { UserList } from './features/maintenance/pages/users/user-list/user-list';
import { LayoutBase } from './layout/layout-base/layout-base';
import { LayoutLogin } from './layout/layout-login/layout-login';
import { RoleList } from './features/maintenance/pages/roles/role-list/role-list';
import { Dashboard } from './features/principal/pages/dashboard/dashboard';
import { TicketList } from './features/principal/pages/tickets/ticket-list/ticket-list';
import { SedeList } from './features/maintenance/pages/sedes/sede-list/sede-list';
import { PrioridadList } from './features/maintenance/pages/prioridades/prioridad-list/prioridad-list';
import { EstadoList } from './features/maintenance/pages/estados/estado-list/estado-list';
import { CategoriaList } from './features/maintenance/pages/categorias/categoria-list/categoria-list';
import { TicketDetails } from './features/principal/pages/tickets/ticket-details/ticket-details';
import { PermisosAddRemove } from './features/maintenance/pages/permisos/permisos-add-remove';
import { TicketListaComponent } from './features/ticket/component/ticket-lista/ticket-lista.component';
import { TicketDetalleComponent } from './features/ticket/component/ticket-detalle/ticket-detalle';
export const routes: Routes = [
    { path : '', redirectTo : 'login',pathMatch : 'full'},
    { path : 'login',component : LayoutLogin},
    { path : 'dashboard',
        component : LayoutBase,
        children : [
            { path : '',component : Dashboard}
        ]
    },
    {
        path : 'principal',
        component : LayoutBase,
        children : [
            { path : '', component : TicketList},
            { path : 'tickets',component : TicketList},
            { path : 'ticket-detail/:ticketId',component : TicketDetails }
        ]
    },
    {
        path : 'maintenance',
        component : LayoutBase,
        children : [
            { path : '', component : SedeList},
            { path : 'prioridades',component : PrioridadList},
            { path : 'estados',component : EstadoList},
            { path : 'categorias',component : CategoriaList},
            { path : 'sedes',component : SedeList}
        ]
    },
    {
        path : 'security',
        component : LayoutBase,
        children : [
            { path : 'users',component : UserList},
            { path : 'roles',component : RoleList},
            { path : 'permisos',component : PermisosAddRemove},
        ]
    },
     // Lista general — admin y técnico ven todos
    {
        path:      'tickets',
        component: TicketListaComponent,
        data:      { modo: 'todos' }
    },
    
    // Mis tickets — el solicitante ve los suyos
    {
        path:      'mis-tickets',
        component: TicketListaComponent,
        data:      { modo: 'mis-tickets' }
    },
    
    // Mis asignaciones — el técnico ve los suyos
    {
        path:      'mis-asignaciones',
        component: TicketListaComponent,
        data:      { modo: 'mis-asignaciones' }
    },
    
    // Detalle del ticket
    {
        path:      'tickets/:publicId',
        component: TicketDetalleComponent
    },
    {path : '**', redirectTo : 'login'}
];
