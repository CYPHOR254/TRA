import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  NgbModalRef,
  NgbModal,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from 'ngx-custom-validators';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-standards',
  templateUrl: './all-standards.component.html',
  styleUrls: ['./all-standards.component.scss'],
})
export class AllStandardsComponent implements OnInit {
  public form: FormGroup;
  errorMsg: string;
  defaultProfileImage: SafeResourceUrl = 'assets/images/no_I.png';
  defaultIcon: SafeResourceUrl = 'assets/images/icon.png';
  existingImage: SafeResourceUrl;
  hasError: boolean = false;
  isLoading: boolean = false;
  errorMessage: string;
  modalRef: NgbModalRef;
  loading: boolean;
  showLeaveCommentForm: boolean = false;
  perPage = 100;
  page = 1;
  standards: any = [];

  constructor(
    private router: Router,
    public modal: NgbModal,
    private httpService: HttpService,
    private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  openStandardInNewTab(standardId: number) {
    this.router.navigate([`/tra-client/standard/${standardId}`]);
  }

  private loadData(): any {
    this.loading = true;
    let model = {
      page: this.page - 1,
      size: this.perPage,
    };
    this.httpService
      .postReq(`/api/v1/standard/portal/getall`, model)
      .subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            // this.standards = res['data'];
            const standard = res.data.standards.filter(
              (request: any) => request.status === 'PUBLISHED'
            );
            this.standards = standard;
            this.standards.forEach((standard: any) => {
              // Modify preview_image_url
              if (standard.previewImageUrl) {
                standard.existingImage =
                  this.sanitizer.bypassSecurityTrustResourceUrl(
                    standard.previewImageUrl
                  );
              } else {
                standard.existingImage = this.defaultProfileImage;
              }

              // Modify preview_icon_url
              if (standard.previewIconUrl) {
                standard.existingIcon =
                  this.sanitizer.bypassSecurityTrustResourceUrl(
                    standard.previewIconUrl
                  );
                standard.iconWidth = '55px';
                standard.iconHeight = '45px';
              } else {
                standard.existingIcon = this.defaultIcon;
                standard.iconWidth = '35px';
                standard.iconHeight = '30px';
              }
            });

            // console.log(this.standards);
            // console.log(this.existingImage);
            this.loading = false;
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
      return 'col-md-4 col-sm-6 col-lg-4 col-xl-4';
    } else {
      return 'col-md-4 col-sm-6 col-lg-3 col-xl-3';
    }
  }

  handleImageError(event: any, link: string) {
    event.target.src = link;
  }
}
