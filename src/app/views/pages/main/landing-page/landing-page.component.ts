import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NgbModalRef,
  NgbModal,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, of, map } from 'rxjs';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  showLeaveCommentForm: boolean = false;
  inputType = 'password';
  modalRef: NgbModalRef;
  defaultImage: SafeResourceUrl = 'assets/images/no_I.png';
  defaultIcon: SafeResourceUrl = 'assets/images/icon.png';
  existingImage: SafeResourceUrl;
  standards: any = [];

  autoPlayOptions: OwlOptions = {
    items: 2,
    loop: true,
    margin: 5,
    autoplay: true,
    autoWidth: true,
    mouseDrag: false,
    touchDrag: false,
    dots: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 2,
      },
    },
  };

  slidesStore:any = [];
  loginResponse$: Observable<any>;

  perPage = 100;
  page = 1;
  errorMsg: string;
  hasError: boolean = false;
  isLoading: boolean = false;
  errorMessage: string;

  userData$: Observable<any>;
  profile: string | null;
  logo: string | null;
  showMenuItems: boolean = true;
  showDashbord: boolean = false;

  selectedLanguage: any = 'English';
  selectedLanguageFlag: any = 'assets/images/flags/us.svg';
  loading: boolean;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private httpService: HttpService,
    public modal: NgbModal,
    public activeModal: NgbActiveModal  ) {
    this.slidesStore = this.globalService.slideStore()
  }

  ngOnInit(): void {
    this.loadData();

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
    //       console.log(resp);
    //       if (resp) {
    //         this.profile = resp[0]['enterpriseName'];
    //         return resp[0];
    //       }
    //     })
    //   );
    // }
  }

  viewStandard(standardId: number) {
    this.router.navigate(['/standards/view/', standardId]);
  }

  private loadData(): any {
    this.loading = true;
    let model = {
      page: this.page - 1,
      size: this.perPage,
    };
    this.httpService
      .postReq(`/api/v1/standard/portal/getall`, model)
      .subscribe(
        {next:(res: any) => {
          if (res.status == 200) {
            const standard = res.data.standards.filter(
              (request: any) => request.status === 'PUBLISHED'
            );

            this.standards = [...standard];
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

          } else {
            this.standards = [];
            console.log('Failed', 'Unable to fetch standards', 'error');
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.loading = false;
          this.standards = [];
          console.log('Error', error.message, 'error');
        }}
      );
  }


  handleImageError(event: any, link: string = 'assets/images/no_I.png') {
    event.target.src = link;
  }
}
