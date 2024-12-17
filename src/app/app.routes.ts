import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewSiteComponent } from './view-site/view-site.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'view-site/:siteId', component: ViewSiteComponent},
    { path: '**', redirectTo: '' }
];
