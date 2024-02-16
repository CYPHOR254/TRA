import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  SafeUrl,
  SafeResourceUrl,
  DomSanitizer,
} from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  NgbModalRef,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from 'ngx-custom-validators';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-standard',
  templateUrl: './view-standard.component.html',
  styleUrls: ['./view-standard.component.scss'],
})
export class ViewStandardComponent implements OnInit {
  returnUrl: any;
  public form: FormGroup;
  public forms: FormGroup;
  public formC: FormGroup;
  public showingPassword = false;

  modalRef: NgbModalRef;
  inputType = 'password';
  errorMessage: string;
  loading: boolean;
  standard: any;
  // Store the sanitized URL
  public downloadLink: SafeUrl;
  currentDescription = '';
  standards: any = [];

  loginResponse$: Observable<any>;

  previewImageUrl: string = '';
  errorMsg: string;
  hasError: boolean = false;
  isLoading: boolean = false;

  showAssessors: boolean = false;

  committee: any = [];
  isCommittee: boolean = false;
  selectedLanguage: any = 'English';
  selectedLanguageFlag: any = 'assets/images/flags/us.svg';
  selectedAssessor: any;
  images: string[];
  currentIndex: number;
  changeIndex: (index: any) => void;
  public standardId: number;
  showLeaveCommentForm: boolean = false;
  showRequestForm: boolean = false;
  file: any;
  certificateData: any;
  selectedPart: any;
  userData$: Observable<any>;
  profile: string | null;
  logo: string | null;
  showMenuItems: boolean = true;
  showDashbord: boolean = false;
  parts: any[] = [];
  terms: any;
  isOffline: any;
  isImageFromServer: boolean;
  files: any;

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
    public activatedRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    fb: FormBuilder,
    public modal: NgbModal
  ) {
    // this.downloadLink = this.sanitizer.bypassSecurityTrustUrl(this.brochureUrl);

    this.form = fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: [
        '',
        Validators.compose([Validators.required, CustomValidators.email]),
      ],
      occupation: ['', Validators.compose([Validators.required])],
      purpose: ['', Validators.compose([Validators.required])],
      phoneNumber: [
        '',
        Validators.compose([Validators.required, this.phoneNumberValidator]),
      ],
    });

    this.forms = fb.group({
      comment: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (typeof params.id !== 'undefined') {
        this.standardId = params.id;
      }
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.loadData();
  }

  get f(): { [p: string]: AbstractControl } {
    return this.form.controls;
  }

  phoneNumberValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const phoneNumber = control.value;
    const phonePattern = /^(254\d{9}|0\d{9})$/;
    return phonePattern.test(phoneNumber) ? null : { invalidPhoneNumber: true };
  }

  showDescription(part: any) {
    let allElem = document.getElementsByClassName(`part-title`);
    for (let i = 0; i < allElem.length; i++) {
      allElem[i].classList.remove('under');
    }

    if (part !== 'comm') {
      this.selectedPart = part;
      this.isCommittee = false;
      let elem = document.getElementById(`${part['id']}part`);
      elem?.classList.add('under');
    } else {
      // this.selectedPart = 'part';
      this.isCommittee = true;
      let elem = document.getElementById(`comm`);
      elem?.classList.add('under');
    }
  }

  private loadData(): any {
    this.loading = true;
    let model = {
      id: this.standardId,
    };
    this.httpService.postReq(`/api/v1/standard/portal/getById`, model).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.standard = res['data']['standard']['standard'];
          this.previewImageUrl = res.data.standard.standard.previewImageUrl;

          this.previewImageUrl =
            this.previewImageUrl !== null &&
            this.previewImageUrl.includes('https://')
              ? this.previewImageUrl
              : 'https://'.concat(this.previewImageUrl);

          this.loading = false;
          // console.log(this.existingImage)
          this.parts = res['data']['standard']['parts'];
          this.selectedPart = this.parts[0];

          this.terms = res['data']['standard']['terms'];
          this.files = res['data']['standard']['files'];
          this.committee = res['data']['standard']['committeeList'];
        } else {
          console.log('Failed', 'Unable to fetch standards', 'error');
        }
      },
      error: (error: any) => {
        console.log('Error', error.message, 'error');
      },
    });
  }

  getColumnClass(numItems: number): string {
    if (numItems === 1) {
      return 'col-md-6 col-sm-6 col-lg-4 col-xl-4';
    } else {
      return 'col-md-6 col-sm-6 col-lg-6 col-xl-6';
    }
  }

  downloadCertificate(fileUrl: string, fileType: string) {
    if (fileType === 'PDF') {
      const normalizedFileUrl = 'https://' + fileUrl;

      // Initiating the download
      const link = document.createElement('a');
      link.href = normalizedFileUrl;
      link.target = '_blank';
      link.click();

      this.standard.downloadCount += 1;
      // console.log(this.standard.downloadCount)
    }
  }

  hideRequestForm() {
    this.showRequestForm = false;
    this.form.reset();
  }

  openRequestForm() {
    if (this.showRequestForm) {
      this.showRequestForm = false;
    } else {
      this.showRequestForm = true;
    }
  }

  onRequestStandards() {
    this.isLoading = true;
    const model = {
      standardId: this.standardId,
      name: this.form.value.name,
      phoneNumber: this.form.value.phoneNumber,
      occupation: this.form.value.occupation,
      purpose: this.form.value.purpose,
      emailAddress: this.form.value.email,
    };

    // console.log(model)
    this.httpService
      .postReq(`/api/v1/admin/customer/portal/request-standard`, model)
      .subscribe({
        next: (result: any) => {
          if (result.status === 200) {
            this.isLoading = false;
            this.hideRequestForm();
            // this.loadData();
            Swal.fire(
              'Standard Request Successfully sent to TRA',
              'Success'
            ).then((r) => console.log(r));
          } else {
            this.hideRequestForm();
            Swal.fire('Standard Request Failed, Try Again', 'error').then((r) =>
              console.log(r)
            );
            this.isLoading = false;
          }
        },
        error: () => {
          this.hideRequestForm();
          Swal.fire('Requesting Standard Failed', 'error');
          this.isLoading = false;
        },
      });
  }

  handleImageError() {
    this.previewImageUrl = 'assets/images/no_I.png';
  }
}
