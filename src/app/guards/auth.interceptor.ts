import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is for login or signup, and skip adding Authorization header
    const excludedUrls = ['/login', '/signup']; // Add the correct paths for login/signup API
    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    if (!isExcluded) {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('accessToken'); // Assuming the token is stored as 'jwtToken'

      if (token) {
        // Clone the request to add the Authorization header
        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });

        // Pass the cloned request to the next handler
        return next.handle(clonedRequest);
      }
    }

    // If no token, or if the request is for login/signup, proceed as is
    return next.handle(req);
  }
}