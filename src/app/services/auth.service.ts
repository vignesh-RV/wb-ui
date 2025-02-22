import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: any = {};
  googleUser: any = {};
  constructor(private router: Router, private api: ApiService) {
    this.currentUser = this.getCurrentUser(true);

    if(this.isAuthenticated()){
      this.initiateAutoRenewal();
    }
    
    this.loadGoogleScript().then(() => {
      google.accounts.id.initialize({
        client_id: '216082513510-u48ahdg9mkdc83gt5ale6mnsupb8gr1a.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this)
      });
    }).catch(err => console.error("Google script load error:", err));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  tokenInterval:any;
  initiateAutoRenewal() {
    clearInterval(this.tokenInterval);
    this.tokenInterval = setInterval(() => {
      let diff  = parseInt(localStorage.getItem('expiry')||'0') - new Date().getTime();
      if(diff < 0){
        this.doLogout();
        clearInterval(this.tokenInterval);
      }else if( diff > 0 && diff < 1000 * 60){
        this.getToken();
        clearInterval(this.tokenInterval);
      }
    }, 1000);
  }

  doLogin(data:any): any{
    data.password = btoa(data.password);
    this.api.showLoader();
    this.api.handleRequest('post', '/user/login', null, data).then((res: any) => { 
      this.api.hideLoader();
      if(res){
        Object.keys(res).forEach(key => localStorage.setItem(key, res[key]));
        this.navigateToHome();
        this.getCurrentUser(true);
      }else{
        this.api.error("Invalid Credentials");
      }
    },
    (err: any) => { this.api.hideLoader(); })
  }

  getToken(): any{
    let data = {'refreshToken': localStorage.getItem('refreshToken')};
    this.api.handleRequest('post', '/api/refresh', null, data).then((res: any) => {
      if(res){
        Object.keys(res).forEach(key => localStorage.setItem(key, res[key]));
        this.initiateAutoRenewal();
      }else{
        this.api.error("Failed to fetch token..");
      }
    })
  }

  doLogout(): any{
    localStorage.clear();
    this.router.navigate(['/login'],{skipLocationChange:true});
  }

  navigateToHome(){
    this.router.navigate(['/'],{skipLocationChange:true});
  }

  navigateToLogin(){
    this.router.navigate(['/login'],{skipLocationChange:true});
  }

  navigateToSignup(){
    this.router.navigate(['/signup'],{skipLocationChange:true});
  }

  getCurrentUser(fetchFromDB?:boolean): any{
    if(this.isAuthenticated() && fetchFromDB){
      this.fetchCurrentUser();
    }
    return JSON.parse(localStorage.getItem('userdata')||'{}');
  }

  fetchCurrentUser() {
      
      this.api.handleRequest('get', '/api/user/current').then((res: any) => {
        if (res) {
          localStorage.setItem('userdata', JSON.stringify(res));
          this.currentUser = res;
        }else{
          this.api.error("Failed to fetch current user..");
          this.doLogout();
        }
      }, (err)=>{
        this.api.error("Failed to fetch current user.." + err);
        this.doLogout();
      })
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.hasOwnProperty('google')) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      }
    });
  }

  showGoogleLogin() {
    google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    console.log("Google Token:", response.credential);
    this.decodeJwtResponse(response.credential);
  }

  decodeJwtResponse(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    this.googleUser = JSON.parse(jsonPayload);
    localStorage.setItem('google_user', jsonPayload);
    console.log('User Info:', this.googleUser);
  }
}