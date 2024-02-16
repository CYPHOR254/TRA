import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EMPTY, catchError, retry, throwError, timeout } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { request } from 'http';

@Injectable({
  providedIn: 'root',
})
export class CheckTokenValidityInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    //  private toast: NgToastService,
    private authService: AuthService,
    private globalService: GlobalService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes("/token")) {
      request = this.addLoginHeader(request);
    } 
    else if (request.url.includes("/activate") || request.url.includes("/portal")) {
      request = request
    }
    else {
      request = this.addAuthorizationHeader(request);
    }

    return next.handle(request).pipe(
      timeout(36000),
      retry(0),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401 && !request.url.includes("/token")) {
          this.router.navigate(["/auth/login"]);
          return throwError(() => "Unauthorized");
        }

        if (error.status === 503) {
          this.router.navigate(["/auth/login"]);
          return throwError(() => "Services Currently Unavailable");
        }

        return throwError(() => error);
      })
    );
  }

  private addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    const tkn = this.globalService.getToken()
    
    const helper = new JwtHelperService();
    console.log(helper.decodeToken(tkn));
          if (helper.isTokenExpired(tkn) ) {
            this.toastr.warning('Logged Out! Session Expired');
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
    
    if (request.body instanceof FormData) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.globalService.getToken()}`,
        // 'Content-Type': 'multipart/form-data',
      });
      return request.clone({ headers });
    } else {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.globalService.getToken()}`,
        "Content-Type": "application/json",
      });
      return request.clone({ headers });
    }
  }

  private addLoginHeader(request: HttpRequest<any>): HttpRequest<any> {
    const xu = "ADMIN_PORTAL";
    const xv = "PAr6hu6n}k;@";
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(xu + ":" + xv),
    });
    return request.clone({ headers });
  }

  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   const isAuthRoute = req.url.includes('/token');
  //   const isStandardsRoute = req.url.includes('/standards/all-standards');

  //   if (isAuthRoute || isStandardsRoute) {
  //     return next.handle(req).pipe(
  //       timeout(36000),
  //       retry(0),
  //       catchError((error: HttpErrorResponse) => {
  //         if (error.status === 401 && !req.url.includes('/token')) {
  //           this.router.navigate(['/auth/login']);
  //           return throwError(() => 'Unauthorized');
  //         }

  //         return throwError(() => error);
  //       })
  //     );
  //   } else {
  //     const token = this.globalService.getToken();

  //     if (!token) {
  //       localStorage.clear();
  //       this.router.navigate(['/auth/login']);
  //     } else {
  //       const helper = new JwtHelperService();
  //       if (helper.isTokenExpired(token)) {
  //         this.toastr.warning('Logged Out! Session Expired');
  //         this.authService.logout();
  //         this.router.navigate(['/auth/login']);
  //       }
  //     }

  //     const headers = new HttpHeaders({
  //       Authorization: `Bearer ${this.globalService.getToken()}`,
  //       'Content-Type': 'application/json',
  //     });
  //     return req.clone({ headers });
  //   }

  //   return next.handle(req).pipe(
  //     catchError((error) => {
  //       // console.log(error);
  //       return EMPTY;
  //     })
  //   );
  // }

  // isTokenValid() {
  //   const helper = new JwtHelperService();
  //   const token = this.globalService.getToken();

  //   if (!token) {
  //     console.log('No token available');
  //     return false;
  //   } else if (helper.isTokenExpired(token)) {
  //     // You might want to put some refresh logic here
  //     console.log('Token expired');
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
}
