import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ConfirmDialogComponent} from "../../../../shared/components/confirm-dialog/confirm-dialog.component";
import Swal from "sweetalert2";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {HttpService} from "../../../../shared/services/http.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "ngx-custom-validators";

@Component({
  selector: 'app-changePassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss']
})
export class ChangeAuthPasswordComponent implements OnInit {
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
        return
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ MatchPassword: true });
      }
      else {
        matchingControl.setErrors(null);
      }
    }

  }
  constructor(private router: Router,
              private route: ActivatedRoute,
              private httpService: HttpService,
              private modalService: NgbModal,

              fb: FormBuilder,

  ) {
    this.form = fb.group({
      password: ['',Validators.compose([Validators.required, Validators.minLength(6)])],
      newPassword: ['',Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['',Validators.compose([Validators.required, Validators.minLength(6)])],
    },
    {
      validators: this.MatchPassword('newPassword', 'confirmPassword')
    });
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(e: Event) {
    console.log("On button click")
    e.preventDefault();

    this.setPassword();
  }

  setPassword(){
    this.modalRef = this.modalService.open(ConfirmDialogComponent, {centered: true});
    this.modalRef.componentInstance.title = 'Change Password';

    this.modalRef.componentInstance.body= "Do you want to Set this as your new password?";
    this.modalRef.result.then((result) => {
      if (result === 'success') {

        const model = {
          password: this.form.value.password,
          newPassword: this.form.value.newPassword,
          confirmPassword: this.form.value.confirmPassword
        };

        this.httpService.postReq('/api/v1/auth/change-password', model).subscribe(
          (result: any) => {
            if (result.status === '00') {
              Swal.fire('Password Set',  'Password Changed Successfully.',  'success')
              // Navigate back to login screen.
              this.router.navigate(["/auth/login"]);
            } else {
              Swal.fire('Error',  'You have entered an incorrect password',  'error')
            }
          }
        );
      } else {
        console.log("Error occurred")
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
