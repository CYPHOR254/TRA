import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  showLeaveCommentForm: boolean = false;
  form: FormGroup;
  isLoading: boolean = false;

  @Output() eventName = new EventEmitter<any>();

  constructor(public fb: FormBuilder, private httpService: HttpService) {
    this.form = fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: [
        '',
        Validators.compose([Validators.required, CustomValidators.email]),
      ],
      subject: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])],
      phone_number: [
        '',
        Validators.compose([Validators.required, this.phoneNumberValidator]),
      ],
    });
  }

  ngOnInit(): void {}

  phoneNumberValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const phoneNumber = control.value;
    const phonePattern = /^(254\d{9}|0\d{9})$/;
    return phonePattern.test(phoneNumber) ? null : { invalidPhoneNumber: true };
  }

  closeModal() {
    this.eventName.emit(false);
  }

  hideLeaveCommentForm() {
    this.showLeaveCommentForm = false;
    this.form.reset();
  }

  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  onleaveComment() {
    this.isLoading = true;
    const model = {
      companyName: this.form.value.name,
      phoneNumber: this.form.value.phone_number,
      subject: this.form.value.subject,
      message: this.form.value.message,
      emailAddress: this.form.value.email,
    };

    this.httpService
      .postReq(`/api/v1/admin/customer/portal/customer-support`, model)
      .subscribe({
        next: (result: any) => {
          if (result.status === 200) {
            this.isLoading = false;
            this.closeModal();
            Swal.fire('Customer Inquiry Successfully sent to TRA', 'Success').then((r) =>
              console.log(r)
            );
          } else {
            this.closeModal();
            Swal.fire('Customer Inquiry  Failed, Try Again', 'Error').then(
              (r) => console.log(r)
            );
            this.isLoading = false;
          }
        },
        error: (error: any) => {
          this.closeModal();
          Swal.fire('Customer Inquiry error', 'error');
          this.isLoading = false;
        },
      });
  }
}
