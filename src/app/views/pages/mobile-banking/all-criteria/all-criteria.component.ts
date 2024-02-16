import { Component, OnInit } from '@angular/core';
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
  selector: 'app-all-criteria',
  templateUrl: './all-criteria.component.html',
  styleUrls: ['./all-criteria.component.scss'],
})
export class AllCriteriaComponent implements OnInit {
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
  criterias: any = [];

  constructor(
    private router: Router,
    fb: FormBuilder,
    public modal: NgbModal,
    private httpService: HttpService,
    private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  openCriteriaInNewTab(criteria: any) {
    window.open(criteria['downloadUrl'], '_blank');
  }

  private loadData(): any {
    this.loading = true;
    let model = {
      page: this.page - 1,
      size: this.perPage,
    };
    this.httpService
      .postReq(
        `/api/v1/admin/classification-tool/get-all-classification-criteria`,
        model
      )
      .subscribe(
        (res: any) => {
          console.log(res);

          if (res.status == 200) {
            // this.standards = res['data'];
            const criteriaList = res.data.filter(
              (request: any) => request.status === 'PUBLISHED'
            );

            this.criterias = criteriaList;

            this.loading = false;
          } else {
            console.log('Failed', 'Unable to fetch standards', 'error');
          }
        },
        (error: any) => {
          console.log('Error', error.message, 'error');
        }
      );
  }

  getColumnClass(numItems: number): string {
    if (numItems === 1) {
      return 'col-md-4 col-sm-6 col-lg-4 col-xl-4';
    } else {
      return 'col-md-4 col-sm-6 col-lg-3 col-xl-3';
    }
  }

  openModal(modalContent: any) {
    this.modalRef = this.modal.open(modalContent, {
      centered: true,
      size: 'md',
    });
  }
}
