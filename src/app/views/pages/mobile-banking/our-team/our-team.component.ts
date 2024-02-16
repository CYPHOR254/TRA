import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.scss'],
})
export class OurTeamComponent implements OnInit {
  defaultProfileImage = 'assets/images/others/icons8-user-80.png';
  existingImage: string;

  assessors: any = [];
  auditors: any = [];

  directors: any = [];
  managers: any = [];

  allAssessors: any = [];
  allManagement: any = [];

  autoPlayOptions: OwlOptions = {
    items: 1,
    loop: true,
    margin: 5,
    autoplay: true,
    autoWidth: true,
    mouseDrag: false,
    touchDrag: false,
    dots: false,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 5,
      },
      1000: {
        items: 6,
      },
    },
  };

  autoPlayOptionsSmall: OwlOptions = {
    items: 1,
    loop: true,
    margin: 5,
    autoplay: true,
    autoWidth: true,
    mouseDrag: false,
    touchDrag: false,
    dots: false,
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

  constructor(private httpService: HttpService, public router: Router) {}

  ngOnInit() {
    this.loadData();
    this.loadMngt();
  }

  private loadData(): any {
    this.httpService
      .postReq(`/api/v1/admin/employee/get/all`, { page: 0, size: 100 })
      .subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.assessors = res['data'];

            this.assessors.forEach((assessor: any) => {
              if (assessor.profileUrl) {
                assessor.profile_url = assessor.profileUrl.replace(
                  '10.20.2.19:7600',
                  'https://test-api.ekenya.co.ke/tra-backend'
                );
                assessor.profile_url = assessor.profile_url.includes('https')
                  ? assessor.profile_url
                  : 'https://'.concat(assessor.profile_url);

                assessor.existingImage = assessor.profile_url;
              } else {
                assessor.existingImage = this.defaultProfileImage;
              }
            });

            // console.log(this.assessors);
            this.allAssessors = [...this.assessors];
            this.auditors = [...this.allAssessors].filter(
              (item: any) => item['position'] == 'AUDITOR'
            );
            this.assessors = [...this.allAssessors].filter(
              (item: any) => item['position'] !== 'AUDITOR'
            );
          } else {
            this.assessors = [];
            this.auditors = [];
            // console.log('Failed', 'Unable to fetch a', 'error');
          }
        },
        error: (error: any) => {
          this.assessors = [];
          this.auditors = [];
          console.log('Error', error.message, 'error');
        },
      });
  }

  private loadMngt(): any {
    this.httpService
      .postReq(`/api/v1/admin/managements/get-all`, { page: 0, size: 100 })
      .subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.allManagement = res['data'];

            this.allManagement.forEach((mngt: any) => {
              if (mngt.profileUrl) {
                mngt.profile_url = mngt.profileUrl.replace(
                  '10.20.2.19:7600',
                  'https://test-api.ekenya.co.ke/tra-backend'
                );
                mngt.profile_url = mngt.profile_url.includes('https')
                  ? mngt.profile_url
                  : 'https://'.concat(mngt.profile_url);

                mngt.existingImage = mngt.profile_url;
              } else {
                mngt.existingImage = this.defaultProfileImage;
              }
            });

            // console.log(this.allManagement);
            this.directors = [...this.allManagement].filter(
              (item: any) => item['userType'] == 'DIRECTOR'
            );
            this.managers = [...this.allManagement].filter(
              (item: any) => item['userType'] == 'MANAGER'
            );
          } else {
            this.directors = [];
            this.managers = [];
            // console.log('Failed', 'Unable to fetch a', 'error');
          }
        },
        error: (error: any) => {
          this.assessors = [];
          this.auditors = [];
          console.log('Error', error.message, 'error');
        },
      });
  }

  handleImageError(event: any) {
    event.target.src = this.defaultProfileImage;
  }
}
