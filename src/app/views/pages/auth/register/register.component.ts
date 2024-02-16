import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public form: FormGroup;
  registerResponse$: Observable<any>;
  errorMsg: string;
  hasError: boolean = false;
  errorType: string = 'danger';
  isLoading: boolean = false;
  enterpriseData: any;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private http: HttpClient,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      krapin: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  ngOnInit(): void {
    // this.getEnterpriseEmail(this.enterpriseData)
    // this.getUsers();
  }

  // getUsers() {
  //   this.httpService.getEnterpriseUsers('api/v1/auth/facilities').subscribe( res=>{
  //     this.enterpriseData = res;
  //     console.log(this.enterpriseData)
  //   })
  // }

  onRegister(e: Event) {
    this.hasError = false;
    this.isLoading = true;
    e.preventDefault();

    // let selectedUser = this.enterpriseData.data.filter((user: any) => user.licenceNo === this.form.value.licenceNo)[0]

    // console.log(selectedUser);

    let model = {
      krapin: this.form.value.krapin,
    };
    console.log(model);
    this.registerResponse$ = this.httpService
      .postReq('/api/v1/admin/customer/portal/activate', model)
      .pipe(
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
            this.hasError = true;
            this.errorMsg = resp['message'];
            this.errorType = 'success';

            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 5000);
          }
          else {
            this.hasError = true;
            this.errorMsg = resp['message'];

            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 5000);
            return resp;
          }
        })
      );
  }
}
