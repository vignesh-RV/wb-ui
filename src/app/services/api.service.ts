import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  loaderTimeout:any;
  _loaderCount:number = 0;
  set loaderCount(number) {
    if(number != this._loaderCount){
      if(this.loaderTimeout) clearTimeout(this.loaderTimeout);
      this.loaderTimeout = setTimeout(()=> this._loaderCount = 0, (10 * 1000));
    }
    this._loaderCount = number;
  }

  get loaderCount(): number {
    return this._loaderCount;
  }

  get environment(): any{
    return (window as any).UIenvironments || environment;
  }

  currentInProgressAPICount:number = 0;

  constructor(private http: HttpClient
    ) { }

  makeRequest(type: string, url: string, body?: any, applicationType?: any) {
    let header:any ={}
    url = this.environment.apiBaseUrl + url;
    switch (type) {
      case 'post': {
        return this.http.post(url, body, {headers: {'Content-Type': 'application/json'}, responseType: 'text', observe: 'response' }) as Observable<HttpResponse<any>>;
      }
      case 'put': {
        return this.http.put(url, body, {headers: {'Content-Type': 'application/json'}, responseType: 'text', observe: 'response' }) as Observable<HttpResponse<any>>;
      }
      case 'download-logs': {
        return this.http.post(url, body, { responseType: 'blob', observe: 'response' }) as Observable<HttpResponse<any>>;
      }
      case 'delete': {
        return this.http.delete(url, { responseType: 'text', observe: 'response',headers:header });
      }
      default: {
        return this.http.get(url, { responseType: 'text', observe: 'response',headers:header });
      }
    }
  }

  downloadFile(url:string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  request(type: string, url: string, body?: any, applicationType?: any) {
    return this.makeRequest(type, url, body, applicationType);
  }

  errorHandler(err: any,type?:string,path?:string) {
    var message = '';
    let errMsg:any = {};
    if (err.error && this.isJSONparsable(err.error) ) {
      message = JSON.parse(err.error).message || JSON.parse(err.error).error ;
      errMsg = JSON.parse(err.error);
    } else {
      message = err && err.error ? err.error : "";
    }
    if (message.toString().toLowerCase() === 'no message available'
      || message === 'Unauthorized access to the resource(INVESTOR)') { return; }
    switch (err.status) {
      case 400: {
        this.error(message || 'Invalid URL Passed');

        break;
      }
      case 500: {
        this.error(message || 'Please try again later');
        break;
      }
      case 404: {
        this.error(message || 'No Data Available');
        break;
      }
      case 415: {
        this.error(message || 'Invalid Content Type');
        break;
      }
      /**
       * UnAuthorised Access
       * Force the user to login page
       **/
      case 401: {
        if (['Expired Token', 'Error Parsing Token'].indexOf(message) !== -1) {
          this.error('Please Try Again');
          // this.logger.setDataObservable('userstatus', 'expired');
        } else if(message == 'Unauthorized' && type == 'get') {
          console.warn(`UnAuthorised Access @ ${path}`);
        } else {
          this.error(message)

        }
        break;
      }
    }
  }

  private isJSONparsable(err: string) {
    try {
      JSON.parse(err)
    }
    catch (error) {
      return false;
    }
    return true;
  }

  handleRequest(type: string, url: string, params?: any, body?: any, applicationType?: any, nonJsonResponse?: any, handleError?: boolean): Promise<any> {
    

    return new Promise((resolve, reject) => {
      this.request(type, url, body, applicationType).subscribe({
        next: (res: any) => {
          if (nonJsonResponse)
            resolve(res.body);
          else
            resolve(res && res.body ? JSON.parse(res.body) : res);
        },
        error: (err: any) => {
          if (!handleError)
            this.errorHandler(err,type);
          reject('error');
        },
        complete: () => { }
      });
    });
  }

  handleRawUrlRequest(type: string, url: string, body?: any, applicationType?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.request(type, url, body, applicationType).subscribe({
        next: (res: any) => {
          resolve(res && res.body ? JSON.parse(res.body) : res);
        },
        error: (err: any) => {
          this.errorHandler(err);
          reject('error');
        },
        complete: () => { }
      });
    });
  }

  showLoader(){
    this.loaderCount++;
  }

  hideLoader(){
    this.loaderCount--;
  }

  error(txt: string){
    console.error(txt);
  }
  info(txt: string){
    console.info(txt);
  }
  success(txt: string){
    console.log(txt);
  }
}


