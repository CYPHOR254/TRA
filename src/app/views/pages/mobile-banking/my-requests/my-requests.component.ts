import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss'],
})
export class MyRequestsComponent implements OnInit {
  actions = ['View'];

  loading = true;
  reorderable = true;
  perPage = 100;
  page = 1;

  public imageFile: File;
  public modalRef: NgbModalRef;

  ClassData: any;
  SubClassData: any;
  accreditations: any;
  requests: any[] = [];

  constructor(
    private httpService: HttpService,
    public fb: FormBuilder,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    public router: Router
  ) {}

  ngOnInit() {
    this.getIndividualData(0);
  }

  viewRequest(id: number) {
    this.router.navigate(['tra-client/requests', id]);
  }

  formatDate(date: string): string {
    const formattedDate = this.datePipe.transform(date, 'dd MMM yyyy');
    return formattedDate ? formattedDate.toUpperCase() : '';
  }

  getSanitizedStatusImage(status: string): any {
    switch (status) {
      case 'APPROVED':
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/images/approve.png'
        );
      case 'PENDING':
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/images/time.png'
        );
      default:
        return this.sanitizer.bypassSecurityTrustResourceUrl(
          'assets/images/fail.png'
        );
    }
  }

  getIndividualData(event: any): void {
    this.loading = true;
    let licenseNumber = localStorage.getItem('licenceNumber')!;
    let taxPin = localStorage.getItem('taxPin')!;

    let model = {
      licenceNumber: licenseNumber,
      page: this.page - 1,
      size: 50,
    };
    this.httpService
      .postReq(
        '/api/v1/admin/customer/portal/get-request-by-licence-number',
        model
      )
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.requests = res.data;
          this.loading = false;
          // console.log(res.data);

          // Sort the requests array by 'createdOn' date in descending order (latest request first)
          this.requests.sort((a: any, b: any) => {
            const dateA = new Date(a.createdOn).getTime();
            const dateB = new Date(b.createdOn).getTime();
            return dateB - dateA;
          });

          this.requests = this.requests.filter(
            (item: any) => item['isProcessed'] == true
          );
          // this.requests = this.requests.map((item: any) => {});
          //  const accreditations = res.data.filter((request:any) => request.request_category === "ACCREDITATION");
          console.log(this.requests);
          // this.requests = accreditations
        } else {
          this.loading = false;
        }
      });
    this.loading = false;
  }
}
