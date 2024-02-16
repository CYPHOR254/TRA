import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public channelManagerHost: string;
  public mobileBankingHost: string;
  public customerPortalNest: string;
  public standardApi: string;
  public standardComments: string;

  public baseApi: string;
  public setting: any = {};

  constructor() {
    this.standardApi = environment.standardsApi;
    this.baseApi = environment.base_uri;
    // this.standardComments = environment.standardsComment;
  }

  public handleServerErrors(result: any): any {
    //   let isValidationError = false;
    //   let errorMessage;
    /*    this.message.error('Encountered an error', { nzDuration: 2000 });
        switch (result.response_code) {
          case 400:
            errorMessage = 'Wrong method';
            break;
          case 401:
            errorMessage = 'Session Expired';
            this.message.error('Your session  has expired', { nzDuration: 4000 });
            break;
          case 403:
            errorMessage = 'UnAuthorized';
            break;
          case 422:
            isValidationError = true;
            errorMessage = Array.from(Object.keys(result.error_messages), k => result.error_messages[k]);
            break;
          case 404:
            errorMessage = 'Not Found';
            break;
          case 500:
            errorMessage = 'Internal Server Error';
            break;
        }
        return { errorMessage: errorMessage, isValidationError: isValidationError  };
        **/
  }

  public validateOnClientSide(validateForm: any): boolean {
    let hasClientValidationError = false;
    for (const i in validateForm.controls) {
      if (validateForm.controls) {
        validateForm.controls[i].markAsDirty();
        validateForm.controls[i].updateValueAndValidity();
        if (validateForm.controls[i].errors !== null) {
          hasClientValidationError = true;
        }
      }
    }
    return hasClientValidationError;
  }

  /**
   * Shuffles array in place. ES6 version
   */

  public getUserInfo(): any {
    const user = localStorage.getItem('user');
    return JSON.parse(user ? user : '');
  }

  public getUserPermissions(): any {
    const permissions = localStorage.getItem('permissions');
    return JSON.parse(permissions ? permissions : '');
  }

  public getToken(): any {
    return localStorage.getItem('access_token');
  }

  public getUserId(): any {
    const user_details = localStorage.getItem('user_details');
    const userDetails = JSON.parse(user_details ? user_details : '');

    return userDetails.user.id;
  }

  public slideStore(): any {
    return [
      {
        id: '1',
        src: 'assets/images/5.jpg',
        title:
          'Halal Compliance Standard For Accommodation And Catering Establishments',
      },
      {
        id: '2',
        src: 'assets/images/1.jpg',
        title: 'Standards For Tourism Tours & Travel Enterprises',
      },
      {
        id: '3',
        src: 'assets/images/3.png',
        title: 'Standards For Spa And Wellness Facilities',
      },
      {
        id: '4',
        src: 'assets/images/7.jpg',
        title: 'Tour Guides And Hotel Employees Accommodation Standard',
      },
      {
        id: '5',
        src: 'assets/images/2.png',
        title:
          'Meetings, Incentives, Conferences & Exhibitions Facilities And Services',
      },
      {
        id: '6',
        src: 'assets/images/4.jpg',
        title: 'Accommodation And Catering Establishment',
      },
      {
        id: '7',
        src: 'assets/images/6.jpg',
        title: 'Standards For Safety And Security Standards',
      },
    ];
  }

  //
  // isAuthenticated() {
  //   const token = this.token;
  //   if (token) {
  //     const tokenExpired = this.jwtHelper.isTokenExpired(token);
  //     if (tokenExpired) {
  //       this.logout();
  //       // this._currentUser =  this.jwtHelper.decodeToken(localStorage.getItem('refresh_token'))
  //     }
  //   }
  // }
}
