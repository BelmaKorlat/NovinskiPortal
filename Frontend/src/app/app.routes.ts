import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { adminRoutes } from './admin/admin.routes';
import { publicRoutes } from './public/public.routes';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin', children: adminRoutes },
    { path: '', children: publicRoutes }
];
