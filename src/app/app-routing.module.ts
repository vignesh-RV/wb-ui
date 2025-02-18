import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
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

const appRoutes = RouterModule.forRoot(routes, {useHash: true});

@NgModule({
  imports: [appRoutes],
  exports: [RouterModule]
})
export class AppRoutingModule { }
