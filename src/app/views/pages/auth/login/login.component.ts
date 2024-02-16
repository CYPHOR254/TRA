import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';

import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  returnUrl: any;
  public form: FormGroup;
  public showingPassword = false;
  inputType = 'password';

  loginResponse$: Observable<any>;

  errorMsg: string;
  hasError: boolean = false;
  isLoading: boolean = false;

  selectedLanguage: any = 'English';
  selectedLanguageFlag: any = 'assets/images/flags/us.svg';

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      email: [
        '',
        Validators.compose([Validators.required, CustomValidators.email]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  ngOnInit(): void {
    localStorage.clear();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(e: Event) {
    this.hasError = false;
    this.isLoading = true;
    e.preventDefault();

    const model = new HttpParams()
      .set('username', this.form.value.email.trim())
      .set('password', this.form.value.password)
      .set('channel', 'FACILITY');

    this.loginResponse$ = this.httpService.loginReq('/oauth/token', model).pipe(
      catchError((error: any) => {
        console.log(error);
        this.hasError = error.message;
        this.isLoading = false;
        return throwError(() => error);
      }),
      map((resp) => {
        console.log(resp);
        this.isLoading = false;

        if (resp['status'] == 200) {
          localStorage.setItem('access_token', resp['data']['access_token']);
          localStorage.setItem('refresh_token', resp['data']['refresh_token']);
          localStorage.setItem('email', this.form.value.email.trim());

          if (resp['data']['firstTimeLogin'] == true) {
            this.router.navigate(['/auth/change-password']);
          } else {
            this.router.navigate(['/dashboard']);
          }

          return resp;
        } else {
          this.isLoading = false;
          this.hasError = true;
          this.errorMsg = resp['message'];
        }
      })
    );
  }
  toggleShowPassword() {
    this.showingPassword = !this.showingPassword;
    if (this.showingPassword) {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }
}
