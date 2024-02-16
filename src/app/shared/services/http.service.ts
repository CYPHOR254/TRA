import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalService } from './global.service';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { forkJoin, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  userId: any;

  constructor(private http: HttpClient, private globalService: GlobalService) {}

  // private generateLoginHead(): { headers: HttpHeaders } {
  //   const xu = 'ADMIN_PORTAL';
  //   const xv = 'PAr6hu6n}k;@';
  //   return {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       Authorization: 'Basic ' + btoa(xu + ':' + xv),
  //     }),
  //   };
  // }

  public loginReq(endpoint: string, model: any): Observable<any> {
    return this.http.post(
      this.globalService.baseApi + endpoint,
      model
      // this.generateLoginHead()
    );
  }

  public postReq(endpoint: string, model: any): Observable<any> {
    return this.http.post(this.globalService.baseApi + endpoint, model);
  }

  public postReqBlob(endpoint: string, model: any): Observable<any> {
    return this.http.post(this.globalService.baseApi + endpoint, model, {
      responseType: 'blob',
    });
  }

  get getRoles() {
    let roles = JSON.parse(localStorage.getItem('roles')!);
    return roles;
  }
}
