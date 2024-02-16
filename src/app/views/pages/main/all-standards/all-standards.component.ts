import { HttpClient } from '@angular/common/http';
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
import { Observable, of, map } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-standards',
  templateUrl: './all-standards.component.html',
  styleUrls: ['./all-standards.component.scss'],
})
export class AllStandardsComponent implements OnInit {
  defaultImage: SafeResourceUrl = 'assets/images/6.jpg';
  defaultIcon: SafeResourceUrl = 'assets/images/icon.png';
  existingImage: SafeResourceUrl;
  // standards: any = []
  standards: any = [];
  SubClassData: any = [];
  // standards: Standard[] = [];
  filteredStandards: any = [];

  selectedSubclassId: number | null = null;

  perPage = 100;
  page = 1;
  errorMsg: string;
  hasError: boolean = false;
  isLoading: boolean = false;
  errorMessage: string;
  loading: boolean;
  showLeaveCommentForm: boolean = false;
  selectedSubClassId: number | null = null;
  public form: FormGroup;
  modalRef: NgbModalRef;
  userData$: Observable<any>;
  profile: string | null;
  logo: string | null;
  showMenuItems: boolean = true;
  showDashbord: boolean = false;
  // filteredStandards: any;
  constructor(
    private router: Router,
    private httpService: HttpService,
    private sanitizer: DomSanitizer,
    public modal: NgbModal,
    public activeModal: NgbActiveModal,
    fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadDatas(null);
    // this.loadData(null);
    this.getSubClassData(0);

    // let userDetails = {
    //   profile: localStorage.getItem('data')
    //     ? JSON.parse(localStorage.getItem('data')!)['user']['name']
    //     : 'Eka Hotel Nairobi',
    // };
    // if (userDetails) {
    //   this.profile = userDetails['profile'];
    //   this.logo =
    //     'https://images.unsplash.com/photo-151740421573-15263e9f9178?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80';

    //   this.userData$ = of(userDetails);
    // } else {
    //   this.userData$ = this.httpService.customerUserDetails().pipe(
    //     map((resp) => {
    //       // console.log(resp);
    //       if (resp) {
    //         this.profile = resp[0]['enterpriseName'];
    //         return resp[0];
    //       }
    //     })
    //   );
    // }
  }

  private loadDatas(subClass: any | null): any {
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
              standard.iconWidth = '35px';
              standard.iconHeight = '30px';

              standard.previewImageUrl =
                standard.previewImageUrl !== null &&
                standard.previewImageUrl.includes('https://')
                  ? standard.previewImageUrl
                  : 'https://'.concat(standard.previewImageUrl);
              standard.previewIconUrl =
                standard.previewIconUrl !== null &&
                standard.previewIconUrl.includes('https://')
                  ? standard.previewIconUrl
                  : 'https://'.concat(standard.previewIconUrl);
            });

            if (subClass !== null) {
              this.filteredStandards = [...this.standards].filter(
                (standard: any) => standard.enterpriseSubClass === subClass
              );
            } else {
              this.filteredStandards = this.standards;
            }
          } else {
            console.log('Failed', 'Unable to fetch standards', 'error');
            this.standards = [];
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.standards = [];
          this.loading = false;
          console.log('Error', error.message, 'error');
        },
      });
  }

  onSubClassChange(event: any): void {
    const selectedSubClass = event.target.value;

    if (selectedSubClass === 'All') {
      this.filteredStandards = this.standards;
    } else {
      this.filteredStandards = this.standards.filter(
        (std: any) => std.enterpriseSubClass === selectedSubClass
      );
    }
  }

  getSubClassData(event: number): void {
    this.loading = true;
    this.httpService
      .postReq('/api/v1/standard/portal/class/getall', {})
      .subscribe((res: any) => {
        // console.log(res)
        if (res.status === 200) {
          if (res.data && res.data.classes) {
            this.loading = false;
            this.SubClassData = res.data.classes;
          } else {
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      });
    this.loading = false;
  }

  viewStandard(standardId: number) {
    this.router.navigate(['/standards/view/', standardId]);
  }

  handleImageError(event: any, link: string = 'assets/images/no_I.png') {
    event.target.src = link;
  }
}
