import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  doLogin(data:any): any{
    localStorage.setItem('authToken',  'true');
    this.navigateToHome();
  }

  doLogout(): any{
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  navigateToHome(){
    this.router.navigate(['/home']);
  }
}