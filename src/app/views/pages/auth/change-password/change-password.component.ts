import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../shared/services/http.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  errorMsg: string;
  hasError: boolean = false;
  isLoading: boolean = false;

  returnUrl: any;
  public modalRef: NgbModalRef;

  public form: FormGroup;
  public showingPassword = false;
  inputType = 'password';

  MatchPassword(passName: string, confirmPassName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[passName];
      const matchingControl = formGroup.controls[confirmPassName];
      if (matchingControl.errors && !matchingControl.errors['MatchPass']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MatchPassword: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: HttpService,
    private modalService: NgbModal,

    fb: FormBuilder
  ) {
    this.form = fb.group(
      {
        resetToken: ['', Validators.compose([Validators.required])],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            this.complexPasswordValidator(),
          ]),
        ],
        confirmPassword: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
      },
      {
        validators: this.MatchPassword('password', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  complexPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;

      // Define the password complexity rules here
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        value
      );
      const isComplex =
        hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;

      // Return the validation result
      return isComplex ? null : { complexPassword: true };
    };
  }

  onSubmit(e: Event) {
    console.log('On button click');
    e.preventDefault();

    this.setPassword();
  }

  setPassword() {
    this.modalRef = this.modalService.open(ConfirmDialogComponent, {
      centered: true,
    });
    this.modalRef.componentInstance.title = 'Set Password';

    this.modalRef.componentInstance.body =
      'Do you want to Set this as your new password?';
    this.modalRef.result.then((result) => {
      if (result === 'success') {
        this.hasError = false;
        this.isLoading = true;
        // const model = {
        //   resetToken: this.form.value.resetToken,
        //   password: this.form.value.password,
        //   confirmPassword: this.form.value.confirmPassword
        // };
        const model = {
          oldPassword: this.form.value.resetToken,
          newPassword: this.form.value.confirmPassword,
        };

        this.httpService
          .postReq('/api/v1/admin/user/update/password', model)
          .subscribe((resp: any) => {
            // if (result.status != '00') {
            //   setTimeout(() => {
            //     Swal.fire('Error',  'You have entered an incorrect password',  'error')
            //     this.hasError = true;
            //     this.errorMsg = result['error'];
            //     this.form.reset()
            //     this.isLoading = false;
            //   }, 2000);
            // } else {
            //   setTimeout(() => {
            //     Swal.fire('Password Set',  'Password Set Successfully.',  'success')
            //     this.router.navigate(["/auth/login"]);
            //     localStorage.setItem('isLoggedin', 'true');
            //     this.isLoading = false;
            //     this.form.reset()
            //   }, 1000);
            // }
            if (resp['status'] == 200) {
              localStorage.clear();
              this.router.navigate(['/auth/login']);

              this.isLoading = false;
              return resp;
            } else {
              this.isLoading = false;
              throw new HttpErrorResponse({
                error: resp,
              });
            }
          });
      }
    });
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
