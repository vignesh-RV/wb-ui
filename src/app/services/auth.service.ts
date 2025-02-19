import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: any = {};
  constructor(private router: Router, private api: ApiService) {
    this.currentUser = this.getCurrentUser(true);

    if(this.isAuthenticated()){
      this.initiateAutoRenewal();
    }
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
    this.router.navigate(['/login']);
  }

  navigateToHome(){
    this.router.navigate(['/home']);
  }

  navigateToLogin(){
    this.router.navigate(['/login']);
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
}