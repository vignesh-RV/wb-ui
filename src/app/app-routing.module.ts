import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LandingComponent
  },
  {
    path: 'signup',
    component: LandingComponent
  },
  {
    path: '404',
    component: NotfoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

const appRoutes = RouterModule.forRoot(routes);

@NgModule({
  imports: [appRoutes],
  exports: [RouterModule]
})
export class AppRoutingModule { }
