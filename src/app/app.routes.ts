import { Routes } from '@angular/router';
import { UserList } from './features/maintenance/pages/users/user-list/user-list';
import { LayoutBase } from './layout/layout-base/layout-base';
import { LayoutLogin } from './layout/layout-login/layout-login';
import { RoleList } from './features/maintenance/pages/roles/role-list/role-list';
import { Dashboard } from './features/principal/pages/dashboard/dashboard';
import { TicketList } from './features/principal/pages/tickets/ticket-list/ticket-list';
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
            { path : 'tickets',component : TicketList}
        ]
    },
    {
        path : 'security',
        component : LayoutBase,
        children : [
            { path : 'users',component : UserList},
            { path : 'roles',component : RoleList}
        ]
    },
    {path : '**', redirectTo : 'login'}
];
