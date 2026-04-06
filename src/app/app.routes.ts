import { Routes } from '@angular/router';
import { UserList } from './features/maintenance/pages/users/user-list/user-list';
import { LayoutBase } from './layout/layout-base/layout-base';
import { LayoutLogin } from './layout/layout-login/layout-login';

export const routes: Routes = [
    { path : 'login',component : LayoutLogin},
    {
        path : 'security',
        component : LayoutBase,
        children : [
            { path : 'users',component : UserList}
        ]
    },
    {path : '**', redirectTo : 'login'}
];
