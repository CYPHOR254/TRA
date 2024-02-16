import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { NotificationModalComponent } from '../../../shared/components/notification-modal/notification-modal.component';
import { NotificationService } from '../../../shared/services/NotificationService';
import { Notification } from '../../../shared/services/Notification';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userData$: Observable<any>;
  companyEmail: string | null;
  licenceNumber: string | null;
  profile: string | null;
  companyRegistrationDate: string | null;
  county: string | null;
  contactPerson: string | null;
  logo: string | null;
  ChangePassword: boolean = false;

  public modalRef: NgbModalRef;
  public form: FormGroup;

  // internationalization management
  selectedLanguage: any = 'English';
  selectedLanguageFlag: any = 'assets/images/flags/us.svg';
  public notifications: Notification[];
  enterpriseData: any;

  errorMsg: string;
  hasError: boolean = false;
  isLoading: boolean = false;

  returnUrl: any;
  public showingPassword = false;
  inputType = 'password';
  facilityData: any;

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
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private httpService: HttpService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {
    this.form = fb.group(
      {
        password: [
          '',
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
        newPassword: [
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
        validators: this.MatchPassword('newPassword', 'confirmPassword'),
      }
    );
  }

  ngOnInit(): void {
    // Subscribe to notification service observable
    this.notificationService.castNotifications.subscribe(
      (notifications: Notification[]) => {
        this.notifications = notifications;
      }
    );

    this.updateNotificationList();

    // let userDetails = JSON.parse(localStorage.getItem('userData')!);
    this.loadData();
  }

  private loadData(): any {
    // let userId = JSON.parse(localStorage.getItem('data')!)['user']['id'];
    let model = {
      email: localStorage.getItem('email')!,
    };
    // console.log(model)
    this.httpService
      .postReq(`/api/v1/admin/customer/get-customer`, model)
      .subscribe({
        next: (res: any) => {
          console.log(res);

          if (res.status == 200) {
            // this.profileDetails = res['data'];
            this.facilityData = res['data'];
            // this.loadResults();

            // if (
            //   this.profileDetails.PhotoPath &&
            //   !this.profileDetails.PhotoPath.startsWith('http://') &&
            //   !this.profileDetails.PhotoPath.startsWith('https://')
            // ) {
            //   this.uploadedImageUrl =
            //     'https://' + this.profileDetails.PhotoPath;
            // } else {
            //   this.uploadedImageUrl =
            //     this.profileDetails.PhotoPath || 'assets/images/sd.png'; // Use the default image if PhotoPath is empty
            // }
            // console.log(this.uploadedImageUrl)
          } else {
            // console.log('Failed', 'Unable to fetch profile', 'error');
          }
        },
        error: (error: any) => {
          // console.log('Error', error.message, 'error');
        },
      });
    // this.httpService
    //   .customerPortalPost(`api/v1/auth/getProfile`, model)
    //   .subscribe(
    //     (res: any) => {
    //       if (res.status == '00') {
    //         this.profileDetails = res['data'];
    //         if (
    //           this.profileDetails.PhotoPath &&
    //           !this.profileDetails.PhotoPath.startsWith('http://') &&
    //           !this.profileDetails.PhotoPath.startsWith('https://')
    //         ) {
    //           this.uploadedImageUrl =
    //             'https://' + this.profileDetails.PhotoPath;
    //         } else {
    //           this.uploadedImageUrl =
    //             this.profileDetails.PhotoPath || 'assets/images/sd.png'; // Use the default image if PhotoPath is empty
    //         }
    //         // console.log(this.uploadedImageUrl)
    //         this.loading = false;
    //       } else {
    //         console.log('Failed', 'Unable to fetch profile', 'error');
    //       }
    //     },
    //     (error: any) => {
    //       console.log('Error', error.message, 'error');
    //     }
    //   );
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

  openChangePassword() {
    if (this.ChangePassword) {
      this.hideChangePassForm();
    } else {
      this.ChangePassword = true;
    }
  }

  hideChangePassForm() {
    this.ChangePassword = false;
    this.form.reset();
  }

  updateNotificationList() {
    console.log('Nmechapa toggle');
    this.pullNotificationsList();
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    localStorage.clear();
    if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    }
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    if (lang === 'en') {
      this.selectedLanguage = 'English';
      this.selectedLanguageFlag = 'assets/images/flags/us.svg';
    } else if (lang === 'kis') {
      this.selectedLanguage = 'Kiswahili';
      this.selectedLanguageFlag = 'assets/images/flags/ke.svg';
    }
  }

  openNotificationModal() {
    this.router.navigateByUrl(`/mobile-banking/workflows/my-task/${7}`);

    this.modalRef = this.modalService.open(NotificationModalComponent, {
      centered: true,
      size: 'lg',
    });
    this.modalRef.componentInstance.title = 'Approve Create User';
    this.modalRef.result.then((result) => {
      if (result === 'success') {
      } else {
        console.log('Error occurred');
      }
    });
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
    this.modalRef.componentInstance.title = 'Change Password';

    this.modalRef.componentInstance.body =
      'Do you want to Set this as your new password?';
    this.modalRef.result.then((result) => {
      if (result === 'success') {
        this.hasError = false;
        this.isLoading = true;

        const model = {
          oldPassword: this.form.value.password,
          newPassword: this.form.value.confirmPassword,
        };

        this.httpService
          .postReq('/api/v1/admin/user/update/password', model)
          .subscribe((resp: any) => {
            if (resp['status'] == 200) {
              localStorage.clear();
              Swal.fire(
                'Password Set',
                'Password Changed Successfully.',
                'success'
              );
              this.router.navigate(['/auth/login']);

              this.isLoading = false;
              return resp;
            } else {
              Swal.fire(
                'Password Not Set',
                'Password Changed Failed.',
                'error'
              );
              this.isLoading = false;
              throw new HttpErrorResponse({
                error: resp,
              });
            }
          });
      } else {
        console.log('Error occurred');
      }
    });
  }

  openModal(modalContent: any) {
    this.modalRef = this.modalService.open(modalContent, {
      centered: true,
      size: 'md',
    });
  }
  closeModal() {
    this.activeModal.close();
  }
  toggleShowPassword() {
    this.showingPassword = !this.showingPassword;
    if (this.showingPassword) {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }
  private pullNotificationsList() {
    const model = {
      userName: 'maina.alex@eclectics.io',
    };

    // this.httpService.mobileBankingPost('workflow/staged', model).subscribe(
    //   (result: any) => {
    //     if (result.status === 200) {
    //       console.log("workflow result");
    //       console.log(result);

    //       let response = result['data'].map((item: any, index: any) => {
    //         let res = {...item,
    //           stagerDetails: JSON.parse(item.stagingUserDetails)
    //         };
    //         return res;
    //       })

    //       let updatedResult = response;

    //       this.notificationService.updateNotifications(updatedResult);
    //     } else {

    //     }
    //   }
    // );
  }

  showForm() {
    console.log(this.form);
  }
}
