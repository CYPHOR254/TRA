import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  NgbModalRef,
  NgbActiveModal,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from 'ngx-custom-validators';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-stand',
  templateUrl: './view-stand.component.html',
  styleUrls: ['./view-stand.component.scss'],
})
export class ViewStandComponent implements OnInit {
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
  comments: any = [];
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
    this.httpService
      .postReq(`/api/v1/standard/portal/getById`, model)
      .subscribe({
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
            this.comments = [...res['data']['standard']['comments']].filter(
              (item: any) => item['email'] == localStorage.getItem('email')!
            );

            this.comments.forEach((comm: any) => {
              let x = [...res['data']['standard']['comments']].filter(
                (item: any) => item['replayId'] == comm['id']
              );
              
              if (x !== undefined && x.length !== 0) {
                console.log(x,comm);
                let arrX = [];
                arrX.push(...x)
                comm['replies'] = [...arrX]
              }
            });

            this.comments = this.comments.filter(
              (item: any) => item !== undefined
            );

            console.log(this.comments);
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
      // const normalizedFileUrl = 'https://' + fileUrl;

      // Initiating the download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.click();

      // this.standard.downloadCount += 1;
      // console.log(this.standard.downloadCount)
    }
  }

  onSubmit(): any {
    this.isLoading = true;
    let email = localStorage.getItem('email')!;
    const model = {
      email,
      standardId: this.standardId,
      comment: this.forms.value.comment,
    };
    // console.log(model)
    this.httpService
      .postReq(`/api/v1/standard/portal/comments/add`, model)
      .subscribe({
        next: (result: any) => {
          if (result.status === 200) {
            this.isLoading = false;
            this.activeModal.close('success');
            Swal.fire('Comment Added Successfully', 'success').then((r) =>
              console.log(r)
            );
            this.forms.reset();
            this.loadData();
            this.isLoading = false;
          } else {
            this.activeModal.close('error');
            this.forms.reset();
            Swal.fire('Add Comment Failed, Try Again', 'error').then((r) =>
              console.log(r)
            );
            this.isLoading = false;
          }
        },
        error: () => {
          Swal.fire('Add Comment error', 'error');
        },
      });
  }

  onleaveComment() {
    this.isLoading = true;
    const model = {
      name: this.formC.value.name,
      phone_number: this.formC.value.phone_number,
      subject: this.formC.value.subject,
      message: this.formC.value.message,
      email: this.formC.value.email,
    };
    // console.log(model)
    this.httpService.postReq(`/api/v1/auth/customerEnquirer`, model).subscribe({
      next: (result: any) => {
        if (result.status === '00') {
          this.isLoading = false;
          this.showRequestForm = false;
          this.loadData();
          Swal.fire('Customer Enquire Successfully', 'success').then((r) =>
            console.log(r)
          );
        } else {
          this.showRequestForm = false;
          Swal.fire('Customer Enquire  Failed, Try Again', 'error').then((r) =>
            console.log(r)
          );
          this.isLoading = false;
        }
      },
      error: () => {
        this.showRequestForm = false;
        Swal.fire('Customer Enquire error', 'error');
        this.isLoading = false;
      },
    });
  }

  handleImageError() {
    this.previewImageUrl = 'assets/images/no_I.png';
  }
}
